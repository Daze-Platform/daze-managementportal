import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";

export const PromotionCard = () => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleGetStarted = () => {
    navigate("/promotions");
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6">
      <div className="relative rounded-xl border border-white/20 bg-gradient-to-r from-slate-700/95 via-indigo-700/95 to-violet-700/95 p-[1px] shadow-sm transition-all duration-300 group w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/10 pointer-events-none rounded-xl" />

        {/* Content wrapper */}
        <div className="relative z-10 flex items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-slate-800/85 via-indigo-800/80 to-violet-800/80">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">
                Boost Sales with Promotions
              </h3>
            </div>
            <p className="text-white/80 text-xs leading-tight mt-0.5">
              Launch campaigns to drive more revenue.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              onClick={handleGetStarted}
              className="flex-shrink-0 bg-white text-slate-800 hover:bg-white/95 font-semibold h-10 px-4 text-xs sm:text-sm rounded-lg shadow-sm touch-manipulation"
            >
              Create
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDismissed(true)}
              className="text-white/70 hover:text-white hover:bg-white/10 h-10 w-10 touch-manipulation"
              aria-label="Dismiss promotion"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
