import React, { useEffect, useState } from 'react';

function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Once parent says we're done, play exit animation then unmount
    if (onDone === true) {
      const t = setTimeout(() => setExiting(true), 100);
      return () => clearTimeout(t);
    }
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white ${exiting ? 'splash-exit pointer-events-none' : ''}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Logo block */}
      <div className="flex flex-col items-center gap-4 select-none">
        {/* Logo icon */}
        <div className="splash-logo w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff3f6c] to-[#ff905a] flex items-center justify-center shadow-2xl">
          <svg viewBox="0 0 40 40" className="w-10 h-10 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 10h3l5 14 5-14h4l5 14 5-14h3l-7 20h-4l-5-13.5L22 30h-4L8 10z" />
          </svg>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#282c3f]">
            One<span className="text-[#ff3f6c]">Cart</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">Fashion. Style. You.</p>
        </div>
      </div>

      {/* Progress bar — like Flipkart */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
        <div className="progress-bar-inner h-full w-1/2 bg-gradient-to-r from-[#ff3f6c] to-[#ff905a] rounded-full" />
      </div>

      {/* Subtle tagline */}
      <p className="absolute bottom-6 text-[11px] text-gray-300 tracking-widest uppercase">
        Loading your experience…
      </p>
    </div>
  );
}

export default SplashScreen;
