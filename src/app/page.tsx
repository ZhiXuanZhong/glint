import SearchEvents from '@/components/SearchEvents/SearchEvents';

export default function Home() {
  return (
    <main className="fixed left-0 z-50 h-screen w-screen">
      <div className="absolute left-0 top-0 h-screen w-screen bg-landing_bg bg-cover"></div>
      <div className="absolute left-0 top-0 h-screen w-screen px-60" id="#parallax">
        <div className="pt-36 text-8xl font-bold text-white opacity-70">Dive into Adventure with</div>
        <div className="pt-10 text-5xl font-semibold tracking-widest text-sunrise-500">SECURE</div>
      </div>
      <div className="absolute left-0 top-0 h-screen w-screen bg-landing_fg bg-cover"></div>
      <div className="relative flex h-[calc(100vh_-_5rem)] w-screen flex-col justify-end">
        <div className="relative bottom-1/4 mx-auto w-2/4 rounded-sm border border-moonlight-50 bg-white px-3 py-1 drop-shadow-xl">
          <SearchEvents />
        </div>
      </div>
    </main>
  );
}
