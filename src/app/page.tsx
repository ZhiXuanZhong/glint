import LandingBackground from '@/components/LandingBackground/LandingBackground';
import SearchEvents from '@/components/SearchEvents/SearchEvents';

export default function Home() {
  return (
    <main className="fixed left-0 -z-10 h-screen w-screen md:z-50">
      <LandingBackground />
      <div className="relative flex h-[calc(100vh_-_5rem)] w-screen flex-col justify-end">
        <div className="relative bottom-1/4 mx-auto w-11/12 rounded-sm border border-moonlight-50 bg-white px-3 py-1 drop-shadow-xl md:w-3/4 lg:w-full lg:max-w-4xl">
          <SearchEvents locations="all" category="all" organizerType="all" />
        </div>
      </div>
    </main>
  );
}
