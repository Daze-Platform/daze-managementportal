import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add listener for resize events
    mql.addEventListener("change", onChange);

    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// Additional hook for tablet detection
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: 768px) and (max-width: 1023px)`);
    const onChange = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width <= 1023);
    };

    mql.addEventListener("change", onChange);
    const width = window.innerWidth;
    setIsTablet(width >= 768 && width <= 1023);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isTablet;
}
