// useWebSocket.ts
import { useEffect, useState, useRef } from 'react';

export interface ScoreboardData {
  player1: string;
  player2: string;
  score1: number[];
  score2: number[];
  currentGamePoints1: number;
  currentGamePoints2: number;
  servingPlayer: 'player1' | 'player2';
}

// Create a singleton WebSocket instance outside the hook
let globalWs: WebSocket | null = null;
let globalPath: string | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

// Helper function to get environment variables
const getEnvironmentVars = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    wsUrl: isDevelopment 
      ? (process.env.NEXT_PUBLIC_DEV_WS_URL || 'ws://localhost:8080')
      : (process.env.NEXT_PUBLIC_WS_URL || 'wss://your-production-domain.com'),
    apiKey: isDevelopment
      ? process.env.NEXT_PUBLIC_DEV_WS_API_KEY
      : process.env.NEXT_PUBLIC_WS_API_KEY
  };
};

// Helper function to get the WebSocket URL with API key
const getWebSocketUrl = (path: string): string => {
  const { wsUrl, apiKey } = getEnvironmentVars();
  const cleanBaseUrl = wsUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  const urlWithPath = `${cleanBaseUrl}/${cleanPath}`;
  return apiKey ? `${urlWithPath}?apiKey=${apiKey}` : urlWithPath;
};

export default function useWebSocket(path: string): ScoreboardData | null {
  const [data, setData] = useState<ScoreboardData | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    // Only create a new connection if one doesn't exist or if the path has changed
    if (!globalWs || globalPath !== path) {
      globalPath = path;
      
      const connectWebSocket = () => {
        if (globalWs?.readyState === WebSocket.OPEN) {
          return; // Don't create a new connection if one is already open
        }

        const wsUrl = getWebSocketUrl(path);
        globalWs = new WebSocket(wsUrl);

        globalWs.onopen = () => {
          console.log(`Connected to WebSocket server at ${path}`);
        };

        globalWs.onmessage = (event: MessageEvent) => {
          try {
            const updatedData: ScoreboardData = JSON.parse(event.data);
            setData(updatedData);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        globalWs.onclose = () => {
          console.log(`Disconnected from WebSocket server at ${path}`);
          // Only attempt to reconnect if this is still the current path
          if (globalPath === path) {
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(connectWebSocket, 3000);
          }
        };

        globalWs.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      };

      connectWebSocket();
    }

    // Cleanup function
    return () => {
      // Only close the connection if we're unmounting and the path matches
      if (globalPath === path) {
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
        if (globalWs) {
          globalWs.close();
          globalWs = null;
          globalPath = null;
        }
      }
    };
  }, [path]); // Only depend on path

  return data;
}