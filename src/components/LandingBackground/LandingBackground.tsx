'use client';
import { MouseParallax } from 'react-just-parallax';

const LandingBackground = () => {
  return (
    <div>
      <div className="absolute left-0 top-0 h-screen w-screen bg-landing_bg bg-cover"></div>
      <div className="absolute left-0 top-0 h-screen w-screen px-60" id="#parallax">
        <MouseParallax lerpEase={0.08} strength={0.02}>
          <div className="pt-36 text-8xl font-bold text-white opacity-70">Dive into Adventure with</div>
          <div className="pt-10 text-5xl font-semibold tracking-widest text-sunrise-500">SECURE</div>
        </MouseParallax>
      </div>
      <div className="absolute left-0 top-0 h-screen w-screen bg-landing_fg bg-cover"></div>
    </div>
  );
};

export default LandingBackground;
