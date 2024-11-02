// useWebSocket.ts
import { useEffect, useState } from 'react';

export interface ScoreboardData {
  player1: string;
  player2: string;
  score1: number[];
  score2: number[];
  currentGamePoints1: number;
  currentGamePoints2: number;
  servingPlayer: 'player1' | 'player2';
}

export default function useWebSocket(path: string, apiKey: string): ScoreboardData | null {
  const [data, setData] = useState<ScoreboardData | null>(null);

  useEffect(() => {
    // Include the API key as a query parameter in the WebSocket URL
    const ws = new WebSocket(`ws://localhost:8080${path}?apiKey=${apiKey}`);

    ws.onopen = () => {
      console.log(`Connected to WebSocket server at ${path}`);
    };

    ws.onmessage = (event: MessageEvent) => {
      const updatedData: ScoreboardData = JSON.parse(event.data);
      setData(updatedData);
    };

    ws.onclose = () => {
      console.log(`Disconnected from WebSocket server at ${path}`);
    };

    return () => {
      ws.close();
    };
  }, [path, apiKey]); // Reconnect if path or API key changes

  return data;
}
