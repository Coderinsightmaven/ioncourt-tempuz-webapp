"use client";

import Image from "next/image";
import useWebSocket, { ScoreboardData } from "@/utils/useWebSocket";

interface TennisScoreboardProps {
  width?: number;
  height?: number;
  arrowImageUrl?: string;
  venueLogoUrl: string;
  eventLogoUrl: string;
  tournamentLogoUrl: string;
  path: string;
}

function TennisScoreboard({
  width = 896,
  height = 512,
  arrowImageUrl,
  venueLogoUrl,
  eventLogoUrl,
  tournamentLogoUrl,
  path,
}: TennisScoreboardProps) {
  const baseWidth = 896;
  const baseHeight = 512;

  // Calculate scales
  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  const liveData: ScoreboardData | null = useWebSocket(path);

  const staticData = {
    player1: "J. DOE",
    player2: "A. SMITH",
    score1: [0, 0, 0],
    score2: [0, 0, 0],
    currentGamePoints1: 0,
    currentGamePoints2: 0,
    servingPlayer: "player2",
  };
  const scoreboardData = liveData || staticData;

  const normalizedScore1 = [...scoreboardData.score1, 0, 0, 0].slice(0, 3);
  const normalizedScore2 = [...scoreboardData.score2, 0, 0, 0].slice(0, 3);

  // Calculate consistent font size for both names based on the longer name
  const calculateConsistentNameFontSize = () => {
    const baseSize = 80;
    const maxWidth = width * 0.8;
    const approxCharWidth = baseSize * 0.6;
    
    // Calculate widths for both names
    const name1Width = scoreboardData.player1.length * approxCharWidth;
    const name2Width = scoreboardData.player2.length * approxCharWidth;
    
    // Use the longer name to calculate scale factor
    const maxNameWidth = Math.max(name1Width, name2Width);
    const scaleFactor = Math.min(1, maxWidth / maxNameWidth);
    
    return `${baseSize * scale * scaleFactor}px`;
  };

  // Calculate font size for current score section
  const calculateScoreFontSize = () => {
    const boxHeight = height * 0.16; // Approximate height for each score box
    const boxWidth = width * 0.11; // Approximate width for each score box
    const baseFontSize = 100;
    
    // Calculate scale factors for both dimensions
    const heightScale = boxHeight / baseFontSize;
    const widthScale = boxWidth / baseFontSize;
    
    // Use the smaller scale to ensure text fits in both dimensions
    const scaleFactor = Math.min(heightScale, widthScale) * 0.8; // 0.8 to add some padding
    
    return `${baseFontSize * scaleFactor}px`;
  };

  const namesFontSize = calculateConsistentNameFontSize();

  const renderServingArrow = (player: "player1" | "player2") => {
    if (scoreboardData.servingPlayer === player) {
      if (arrowImageUrl) {
        return (
          <Image
            src={arrowImageUrl}
            alt="Serving Arrow"
            width={50 * scale}
            height={50 * scale}
            style={{ objectFit: "contain" }}
          />
        );
      }
      return (
        <span
          style={{
            fontSize: `${40 * scale}px`,
            color: "#facc15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
        backgroundColor: "black",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: `${62.5 * scale}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1a3c5a",
          padding: `0 ${12.5 * scale}px`,
        }}
      >
        <div
          style={{
            height: "100%",
            position: "relative",
            paddingBottom: `${2 * scale}px`,
          }}
        >
          <Image
            src={venueLogoUrl}
            alt="Venue Logo"
            width={220 * scale}
            height={30 * scale}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            height: "100%",
            position: "relative",
            paddingBottom: `${2 * scale}px`,
          }}
        >
          <Image
            src={eventLogoUrl}
            alt="Event Logo"
            width={195 * scale}
            height={20 * scale}
            style={{ objectFit: "contain" }}
          />
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          color: "white",
        }}
      >
        {/* Player 1 */}
        <div
          style={{
            height: `${80 * scale}px`,
            display: "flex",
            alignItems: "center",
            padding: `0 ${10 * scale}px`,
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: namesFontSize,
              lineHeight: "1",
              margin: 0,
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {scoreboardData.player1}
          </h1>
        </div>

        {/* Center section */}
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: `${10 * scale}px`,
            gap: `${5 * scale}px`,
          }}
        >
          {/* Tournament logo */}
          <div
            style={{
              backgroundColor: "#1a3c5a",
              width: `${395 * scale}px`,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                src={tournamentLogoUrl}
                alt="Tournament Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Scores */}
          <div
            style={{
              display: "flex",
              flex: 1,
              border: `${5 * scale}px solid white`,
              height: "100%",
            }}
          >
            {/* Game scores */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flex: 2,
                borderRight: `${5 * scale}px solid white`,
                backgroundColor: "#1a3c5a",
              }}
            >
              {[normalizedScore1, normalizedScore2].map(
                (scores, playerIndex) => (
                  <div
                    key={playerIndex}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    {scores.map((score, index) => (
                      <span
                        key={index}
                        style={{
                          width: `${80 * scale}px`,
                          textAlign: "center",
                          fontSize: `${100 * scale}px`,
                          lineHeight: "1",
                        }}
                      >
                        {score}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Current points */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                paddingRight: `${5 * scale}px`,
              }}
            >
              {[1, 2].map((playerNum) => (
                <div
                  key={playerNum}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flex: 1,
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: `${40 * scale}px`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {renderServingArrow(
                      `player${playerNum}` as "player1" | "player2"
                    )}
                  </div>
                  <div
                    style={{
                      width: `${100 * scale}px`,
                      textAlign: "center",
                      fontSize: calculateScoreFontSize(),
                      lineHeight: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    {playerNum === 1
                      ? scoreboardData.currentGamePoints1
                      : scoreboardData.currentGamePoints2}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Player 2 */}
        <div
          style={{
            height: `${80 * scale}px`,
            display: "flex",
            alignItems: "center",
            padding: `0 ${10 * scale}px`,
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: namesFontSize,
              lineHeight: "1",
              margin: 0,
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {scoreboardData.player2}
          </h1>
        </div>
      </main>
    </div>
  );
}

export default TennisScoreboard;