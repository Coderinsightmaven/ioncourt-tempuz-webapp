import TennisScoreboard from '@/app/components/TennisScoreboard';

export default function Page() {
  return (
    <TennisScoreboard
      width={896}
      height={512}
      venueLogoUrl="/venue_logo.png"
      eventLogoUrl="/event_logo.png"
      tournamentLogoUrl="/tournament_logo.png"
      path="/tennis/stadium"
      apiKey={process.env.API_KEY || ''} // Pass the API key here
    />
  );
}
