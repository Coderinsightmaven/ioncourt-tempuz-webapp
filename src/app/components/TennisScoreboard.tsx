'use client';

import { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  const liveData: ScoreboardData | null = useWebSocket(path, apiKey);

  useEffect(() => {
    if (containerRef.current) {
      const scaleX = width / baseWidth;
      const scaleY = height / baseHeight;
      const scale = Math.min(scaleX, scaleY);

      containerRef.current.style.transform = `scale(${scale})`;
      containerRef.current.style.transformOrigin = 'top left';
      containerRef.current.style.width = `${baseWidth}px`;
      containerRef.current.style.height = `${baseHeight}px`;

      if (containerRef.current.parentElement) {
        containerRef.current.parentElement.style.overflow = 'hidden';
      }
    }
  }, [width, height]);

  let staticData = {
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

  const renderServingArrow = (player: 'player1' | 'player2') => {
    if (scoreboardData.servingPlayer === player) {
      if (arrowImageUrl) {
        return (
          <Image
            src={arrowImageUrl}
            alt="Serving Arrow"
            width={50}
            height={50}
          />
        );
      }
      return <span className="text-yellow-400 text-4xl">▶</span>;
    }
    return <div className="w-[50px]"></div>;
  };

  return (
    <div className="bg-black" style={{ width: `${width}px`, height: `${height}px`, overflow: 'hidden' }}>
      <div ref={containerRef} className="flex flex-col w-full h-full text-white font-sans">
        <header className="flex-[0_0_62.5px] flex justify-between items-center bg-[#1a3c5a] w-full px-[12.5px]">
          <Image src={venueLogoUrl} alt="Venue Logo" width={250} height={40} />
          <Image src={eventLogoUrl} alt="Event Logo" width={250} height={50} />
        </header>

        <main className="flex-1 flex flex-col w-full">
          <div className="p-0 mt-[2px]">
            <h1 className="text-[80px] leading-none m-0">{scoreboardData.player1}</h1>
          </div>

          <div className="flex w-full items-stretch">
            <div className="flex-shrink-0 bg-[#1a3c5a]">
              <Image src={tournamentLogoUrl} alt="Tournament Logo" width={395} height={117} />
            </div>

            <div className="flex flex-grow border-[5px] border-white">
              <div className="flex flex-col justify-center items-center flex-grow border-r-[5px] border-white bg-[#1a3c5a]">
                <div className="flex items-center my-[5px]">
                  {normalizedScore1.map((score, index) => (
                    <span key={index} className="min-w-[80px] text-center text-[100px] leading-none">
                      {score}
                    </span>
                  ))}
                </div>
                <div className="flex items-center my-[5px]">
                  {normalizedScore2.map((score, index) => (
                    <span key={index} className="min-w-[80px] text-center text-[100px] leading-none">
                      {score}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center items-center flex-grow">
                <div className="flex items-center my-[5px]">
                  <div className="w-[20px] flex justify-center items-center">
                    {renderServingArrow('player1')}
                  </div>
                  <span className="min-w-[80px] text-center text-[100px] leading-none">
                    {scoreboardData.currentGamePoints1}
                  </span>
                </div>
                <div className="flex items-center my-[5px]">
                  <div className="w-[20px] flex justify-center items-center">
                    {renderServingArrow('player2')}
                  </div>
                  <span className="min-w-[80px] text-center text-[100px] leading-none">
                    {scoreboardData.currentGamePoints2}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-0">
            <h1 className="text-[80px] leading-none m-0">{scoreboardData.player2}</h1>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TennisScoreboard;
