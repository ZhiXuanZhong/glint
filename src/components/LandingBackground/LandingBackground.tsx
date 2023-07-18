'use client';
import { MouseParallax } from 'react-just-parallax';

const LandingBackground = () => {
  return (
    <div>
      <div className="absolute left-0 top-0 h-screen w-screen bg-landing_bg bg-cover"></div>
      <div className="absolute left-0 top-0 h-screen w-screen bg-gradient-to-r from-orange-400 to-rose-400 opacity-25"></div>
      <div className="absolute left-0 top-0 h-screen w-screen px-96 pt-56">
        <MouseParallax lerpEase={0.08} strength={0.02}>
          <div className="mr-auto flex gap-[3px] text-white">
            <div className="flex h-9 w-9 items-center justify-center bg-sunrise-500 text-xl">G</div>
            <div className="flex h-9 w-9 items-center justify-center bg-sunrise-500 text-xl">L</div>
            <div className="flex h-9 w-9 items-center justify-center bg-sunrise-500 text-xl">I</div>
            <div className="flex h-9 w-9 items-center justify-center bg-sunrise-500 text-xl">N</div>
            <div className="flex h-9 w-9 items-center justify-center border border-sunrise-500 bg-white bg-opacity-20 text-xl font-medium text-sunrise-500">T</div>
          </div>
          <div className="pt-10 text-5xl font-semibold tracking-widest text-white drop-shadow-xl">探索屬於你的水下探險</div>
        </MouseParallax>
      </div>
    </div>
  );
};

export default LandingBackground;
