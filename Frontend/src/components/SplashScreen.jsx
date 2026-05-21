import React, { useEffect, useState } from 'react';
import logo from '../assets/onecart_logo.png';

function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
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
        {/* Logo image */}
        <div className="splash-logo w-24 h-24 rounded-3xl overflow-hidden shadow-2xl">
          <img src={logo} alt="OneCart" className="w-full h-full object-cover" />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#282c3f]">
            One<span className="text-[#ff3f6c]">Cart</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">Fashion. Style. You.</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
        <div className="progress-bar-inner h-full w-1/2 bg-gradient-to-r from-[#ff3f6c] to-[#ff905a] rounded-full" />
      </div>

      <p className="absolute bottom-6 text-[11px] text-gray-300 tracking-widest uppercase">
        Loading your experience…
      </p>
    </div>
  );
}

export default SplashScreen;
