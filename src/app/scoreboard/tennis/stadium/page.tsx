'use client';

import TennisScoreboard from '@/app/components/TennisScoreboard';
import ResolutionInput from '@/app/components/ResolutionInput';
import { useState } from 'react';

export default function Page() {
  const [resolution, setResolution] = useState({ width: 896, height: 512 });

  const handleResolutionChange = (width: number, height: number) => {
    setResolution({ width, height });
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="flex flex-col gap-4">
        <div style={{ 
          width: `${resolution.width}px`, 
          height: `${resolution.height}px`
        }}>
          <TennisScoreboard
            venueLogoUrl="/venue_logo.png"
            eventLogoUrl="/event_logo.png"
            tournamentLogoUrl="/tournament_logo.png"
            path="/tennis/stadium"
            width={resolution.width}
            height={resolution.height}
          />
        </div>
        <ResolutionInput onResolutionChange={handleResolutionChange} />
      </div>
    </div>
  );
}