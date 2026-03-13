import { useEffect, useState, useCallback } from "react";

export const useFullScreenScroll = () => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Don't update if we haven't moved enough
    if (Math.abs(scrollY - lastScrollY) < 10) {
      return;
    }

    // Hide UI if we've scrolled down significantly (past 100px) and are continuing to scroll down
    const shouldHideUI = scrollY > lastScrollY && scrollY > 100;

    setIsScrollingDown(shouldHideUI);
    setLastScrollY(scrollY);

    console.log(
      `Scroll direction: ${shouldHideUI ? "hiding UI" : "showing UI"}, scrollY: ${scrollY}`,
    );
  }, [lastScrollY]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Enhanced viewport and orientation handling with device detection
    const handleViewportChange = () => {
      const isMobile = window.innerWidth <= 1024;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      // Enhanced CSS custom properties for full viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      // iOS specific viewport handling
      if (isIOS) {
        document.documentElement.style.setProperty(
          "--ios-vh",
          `${window.innerHeight}px`,
        );
        // Force layout recalculation on iOS
        document.body.style.height = `${window.innerHeight}px`;
        setTimeout(() => {
          document.body.style.height = "100vh";
          document.body.style.height = "100dvh";
        }, 100);
      }

      // Enhanced mobile viewport handling
      if (isMobile) {
        // Ensure proper scroll container sizing
        const scrollContainers = document.querySelectorAll(
          ".mobile-scroll-container, .dashboard-scroll, .orders-scroll, .menu-scroll-container",
        );
        scrollContainers.forEach((container) => {
          if (container instanceof HTMLElement) {
            const containerStyle = container.style as any;
            containerStyle.height = "100%";
            containerStyle.overflowY = "auto";
            // Use bracket notation for vendor-prefixed properties
            containerStyle["-webkit-overflow-scrolling"] = "touch";
            containerStyle.paddingBottom = `calc(env(safe-area-inset-bottom) + 20px)`;
          }
        });

        setTimeout(() => {
          updateScrollDirection();
        }, 150);
      }
    };

    // Set initial viewport
    handleViewportChange();

    // Add event listeners with enhanced options for better mobile performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleViewportChange, { passive: true });
    window.addEventListener(
      "orientationchange",
      () => {
        setTimeout(handleViewportChange, 200);
      },
      { passive: true },
    );

    // iOS specific event listeners
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.addEventListener("touchstart", () => {}, { passive: true });
      window.addEventListener("touchmove", () => {}, { passive: true });
    }

    // Initialize after a brief delay to ensure proper setup
    setTimeout(() => {
      setIsInitialized(true);
      updateScrollDirection();
    }, 200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
    };
  }, [updateScrollDirection]);

  return {
    isScrollingDown: isInitialized ? isScrollingDown : false,
    scrollY: lastScrollY,
  };
};
