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
  const headerHeight = 62.5;

  // Calculate scales
  const scaleX = width / baseWidth;
  const scaleY = (height - headerHeight) / (baseHeight - headerHeight);
  const scale = Math.min(scaleX, scaleY);

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
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: 'black',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Fixed-height header that scales only horizontally */}
      <header
        style={{
          height: `${headerHeight}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#1a3c5a',
          width: '100%',
          padding: '0 12.5px',
        }}
      >
        <Image
          src={venueLogoUrl}
          alt="Venue Logo"
          width={220 * scaleX}
          height={30}
          style={{ objectFit: 'contain' }}
        />
        <Image
          src={eventLogoUrl}
          alt="Event Logo"
          width={195 * scaleX}
          height={20}
          style={{ objectFit: 'contain' }}
        />
      </header>

      {/* Main content that scales both horizontally and vertically */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${scaleX})`,
            transformOrigin: 'top left',
          }}
        >
          <main
            style={{
              width: `${baseWidth}px`,
              height: `${baseHeight - headerHeight}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'white',
            }}
          >
            <div style={{ padding: 0, marginTop: '2px' }}>
              <h1
                style={{
                  fontSize: '80px',
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
                  fontSize: '80px',
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
    </div>
  );
}

export default TennisScoreboard;
