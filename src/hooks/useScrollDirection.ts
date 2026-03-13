import { useState, useEffect } from "react";

export const useScrollDirection = (threshold: number = 10) => {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;

      if (scrollY < threshold) {
        setIsAtTop(true);
        setScrollDirection("up");
      } else {
        setIsAtTop(false);
        const direction = scrollY > lastScrollY ? "down" : "up";
        if (
          direction !== scrollDirection &&
          Math.abs(scrollY - lastScrollY) > threshold
        ) {
          setScrollDirection(direction);
        }
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection, threshold]);

  return { scrollDirection, isAtTop };
};
