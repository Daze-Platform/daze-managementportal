import React from "react";

/**
 * Daze-branded loading screen.
 * Uses an animated cloud SVG (the "D" cloud logo concept) with a
 * pulsing shimmer and floating dots — minimal, premium (Vercel/Linear style).
 */
export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
      {/* Cloud SVG with float + shimmer animation */}
      <div className="relative flex items-center justify-center" style={{ width: 72, height: 56 }}>
        {/* Drop shadow layer */}
        <svg
          width="72"
          height="56"
          viewBox="0 0 72 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 blur-md opacity-20 animate-[daze-float_3s_ease-in-out_infinite]"
          aria-hidden="true"
        >
          <path
            d="M57 44H18C8.06 44 0 35.94 0 26C0 17.16 6.36 9.8 14.76 8.24C16.9 3.44 21.74 0 27.4 0C30.36 0 33.1 0.94 35.36 2.54C37.62 1.36 40.18 0.68 42.92 0.68C51.24 0.68 58.04 7.02 58.72 15.14C65.44 16.82 70.4 22.96 70.4 30.24C70.4 37.8 64.3 44 57.32 44H57Z"
            fill="hsl(var(--primary))"
          />
        </svg>

        {/* Main cloud */}
        <svg
          width="72"
          height="56"
          viewBox="0 0 72 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative animate-[daze-float_3s_ease-in-out_infinite]"
          aria-label="Daze loading"
        >
          {/* Cloud body */}
          <path
            d="M57 44H18C8.06 44 0 35.94 0 26C0 17.16 6.36 9.8 14.76 8.24C16.9 3.44 21.74 0 27.4 0C30.36 0 33.1 0.94 35.36 2.54C37.62 1.36 40.18 0.68 42.92 0.68C51.24 0.68 58.04 7.02 58.72 15.14C65.44 16.82 70.4 22.96 70.4 30.24C70.4 37.8 64.3 44 57.32 44H57Z"
            fill="hsl(var(--primary))"
          />
          {/* "D" letterform cut-out / highlight */}
          <path
            d="M24 14h8c6.627 0 12 5.373 12 12s-5.373 12-12 12h-8V14zm4 4v16h4c4.418 0 8-3.582 8-8s-3.582-8-8-8h-4z"
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1.5">
        <span
          className="block w-1.5 h-1.5 rounded-full bg-primary/60 animate-[daze-dot_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="block w-1.5 h-1.5 rounded-full bg-primary/60 animate-[daze-dot_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="block w-1.5 h-1.5 rounded-full bg-primary/60 animate-[daze-dot_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: "400ms" }}
        />
      </div>
    </div>
  );
};
