import LandingBackground from '@/components/LandingBackground/LandingBackground';
import SearchEvents from '@/components/SearchEvents/SearchEvents';

export default function Home() {
  return (
    <main className="fixed left-0 z-50 h-screen w-screen">
      <LandingBackground />
      <div className="relative flex h-[calc(100vh_-_5rem)] w-screen flex-col justify-end">
        <div className="relative bottom-1/4 mx-auto w-2/4 rounded-sm border border-moonlight-50 bg-white px-3 py-1 drop-shadow-xl">
          <SearchEvents locations="NEC" category="divingTravel" organizerType="instructor" />
        </div>
      </div>
    </main>
  );
}
