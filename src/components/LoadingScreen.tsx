import React from "react";

/**
 * Daze-branded loading screen — premium animation using the real D logo.
 * - Breathing scale: 0.95 → 1.05 → 0.95 on a 2s loop
 * - Soft glow pulse behind the logo
 * - Shimmer ring that rotates around the logo
 * - Three dots below in a wave pattern
 * - Clean white background
 */
export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-8">
      {/* Outer container for logo + ring */}
      <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>

        {/* Soft glow bloom behind logo */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(100,160,255,0.22) 0%, rgba(100,160,255,0) 70%)",
            animation: "daze-breath 2s ease-in-out infinite",
          }}
        />

        {/* Rotating shimmer ring */}
        <svg
          className="absolute inset-0"
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: "daze-spin-ring 2.4s linear infinite" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4FA3FF" stopOpacity="0" />
              <stop offset="40%" stopColor="#4FA3FF" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="url(#ringGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="138 138"
            fill="none"
          />
        </svg>

        {/* Logo image — breathing scale */}
        <img
          src="/daze-logo-d-color.png"
          alt="Daze"
          width={56}
          height={56}
          style={{
            animation: "daze-breath 2s ease-in-out infinite",
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
          }}
        />
      </div>

      {/* Wave dots */}
      <div className="flex items-center gap-2">
        {[0, 180, 360].map((delay) => (
          <span
            key={delay}
            style={{
              display: "block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4FA3FF",
              opacity: 0.7,
              animation: `daze-dot-wave 1.4s ease-in-out infinite`,
              animationDelay: `${delay}ms`,
            }}
          />
        ))}
      </div>

      {/* Inline keyframes — scoped to this component so no Tailwind config needed */}
      <style>{`
        @keyframes daze-breath {
          0%, 100% { transform: scale(0.95); opacity: 0.85; }
          50%       { transform: scale(1.05); opacity: 1; }
        }
        @keyframes daze-spin-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes daze-dot-wave {
          0%, 80%, 100% { transform: translateY(0);   opacity: 0.35; }
          40%           { transform: translateY(-7px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
