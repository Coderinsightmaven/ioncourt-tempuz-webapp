'use client';

import Image from 'next/image';
import useWebSocket, { ScoreboardData } from '@/utils/useWebSocket';

interface TennisScoreboardProps {
  width?: number;
  height?: number;
  arrowImageUrl?: string;
  venueLogoUrl: string;
  eventLogoUrl: string;
  tournamentLogoUrl: string;
  path: string;
  apiKey: string;
}

function TennisScoreboard({
  width = 896,
  height = 512,
  arrowImageUrl,
  venueLogoUrl,
  eventLogoUrl,
  tournamentLogoUrl,
  path,
  apiKey,
}: TennisScoreboardProps) {
  const baseWidth = 896;
  const baseHeight = 512;

  // Calculate scale to fill container while maintaining aspect ratio
  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  // Remove the centering calculations
  const scaledWidth = baseWidth * scale;
  const scaledHeight = baseHeight * scale;

  const liveData: ScoreboardData | null = useWebSocket(path, apiKey);

  const staticData = {
    player1: 'J. DOE',
    player2: 'A. SMITH',
    score1: [0, 0, 0],
    score2: [0, 0, 0],
    currentGamePoints1: 0,
    currentGamePoints2: 0,
    servingPlayer: 'player2',
  };
  const scoreboardData = liveData || staticData;

  const normalizedScore1 = [...scoreboardData.score1, 0, 0, 0].slice(0, 3);
  const normalizedScore2 = [...scoreboardData.score2, 0, 0, 0].slice(0, 3);

  const renderServingArrow = (player: 'player1' | 'player2') => {
    if (scoreboardData.servingPlayer === player) {
      if (arrowImageUrl) {
        return (
          <Image
            src={arrowImageUrl}
            alt="Serving Arrow"
            width={50 * scale}
            height={50 * scale}
          />
        );
      }
      return (
        <span
          style={{ fontSize: `${40 * scale}px`, color: '#facc15' }}
        >
          ▶
        </span>
      );
    }
    return <div style={{ width: `${50 * scale}px` }}></div>;
  };

  return (
    <div 
      style={{ 
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: 'black',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Scoreboard */}
        <div
          style={{
            width: `${baseWidth}px`,
            height: `${baseHeight}px`,
          }}
        >
          <header
            style={{
              flex: `0 0 ${62.5 * scale}px`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#1a3c5a',
              width: '100%',
              paddingLeft: `${12.5 * scale}px`,
              paddingRight: `${12.5 * scale}px`,
            }}
          >
            <Image
              src={venueLogoUrl}
              alt="Venue Logo"
              width={250 * scale}
              height={40 * scale}
            />
            <Image
              src={eventLogoUrl}
              alt="Event Logo"
              width={250 * scale}
              height={50 * scale}
            />
          </header>

          <main
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <div style={{ padding: 0, marginTop: `${2 * scale}px` }}>
              <h1
                style={{
                  fontSize: `${80 * scale}px`,
                  lineHeight: '1',
                  margin: 0,
                }}
              >
                {scoreboardData.player1}
              </h1>
            </div>

            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'stretch',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  backgroundColor: '#1a3c5a',
                }}
              >
                <Image
                  src={tournamentLogoUrl}
                  alt="Tournament Logo"
                  width={395 * scale}
                  height={117 * scale}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexGrow: 1,
                  border: `${5 * scale}px solid white`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexGrow: 1,
                    borderRight: `${5 * scale}px solid white`,
                    backgroundColor: '#1a3c5a',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: `${5 * scale}px`,
                      marginBottom: `${5 * scale}px`,
                    }}
                  >
                    {normalizedScore1.map((score, index) => (
                      <span
                        key={index}
                        style={{
                          minWidth: `${80 * scale}px`,
                          textAlign: 'center',
                          fontSize: `${100 * scale}px`,
                          lineHeight: '1',
                        }}
                      >
                        {score}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: `${5 * scale}px`,
                      marginBottom: `${5 * scale}px`,
                    }}
                  >
                    {normalizedScore2.map((score, index) => (
                      <span
                        key={index}
                        style={{
                          minWidth: `${80 * scale}px`,
                          textAlign: 'center',
                          fontSize: `${100 * scale}px`,
                          lineHeight: '1',
                        }}
                      >
                        {score}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexGrow: 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: `${5 * scale}px`,
                      marginBottom: `${5 * scale}px`,
                    }}
                  >
                    <div
                      style={{
                        width: `${20 * scale}px`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {renderServingArrow('player1')}
                    </div>
                    <span
                      style={{
                        minWidth: `${80 * scale}px`,
                        textAlign: 'center',
                        fontSize: `${100 * scale}px`,
                        lineHeight: '1',
                      }}
                    >
                      {scoreboardData.currentGamePoints1}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: `${5 * scale}px`,
                      marginBottom: `${5 * scale}px`,
                    }}
                  >
                    <div
                      style={{
                        width: `${20 * scale}px`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {renderServingArrow('player2')}
                    </div>
                    <span
                      style={{
                        minWidth: `${80 * scale}px`,
                        textAlign: 'center',
                        fontSize: `${100 * scale}px`,
                        lineHeight: '1',
                      }}
                    >
                      {scoreboardData.currentGamePoints2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: 0 }}>
              <h1
                style={{
                  fontSize: `${80 * scale}px`,
                  lineHeight: '1',
                  margin: 0,
                }}
              >
                {scoreboardData.player2}
              </h1>
            </div>
          </main>
        </div>
      </div>

      {/* Input Fields for Custom Resolution */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '10px',
          borderRadius: '5px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        
      </div>
    </div>
  );
}

export default TennisScoreboard;
