import React from "react";
import { Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoreLogoProps {
  logo: string;
  customLogo?: string;
  bgColor?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "sleek" | "minimal" | "glow";
}

export const StoreLogo = ({
  logo,
  customLogo,
  bgColor = "bg-gradient-to-br from-blue-500 to-indigo-600",
  size = "md",
  className = "",
  variant = "sleek",
}: StoreLogoProps) => {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8 sm:w-10 sm:h-10",
    md: "w-10 h-10 sm:w-12 sm:h-12",
    lg: "w-12 h-12 sm:w-16 sm:h-16",
    xl: "w-16 h-16 sm:w-20 sm:h-20",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm sm:text-base",
    md: "text-lg sm:text-xl",
    lg: "text-xl sm:text-2xl",
    xl: "text-2xl sm:text-3xl",
  };

  const iconSizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  // Check if logo is an image path (not emoji)
  const logoIsImage =
    logo &&
    (logo.startsWith("/images/") ||
      logo.startsWith("/brand-assets/") ||
      logo.startsWith("http://") ||
      logo.startsWith("https://"));

  // Only show custom logo if it's a real user upload (not stock image)
  const showCustomLogo =
    logoIsImage ||
    (!!customLogo &&
      (customLogo.startsWith("/brand-assets/") ||
        customLogo.startsWith("/public/brand-assets/") ||
        customLogo.startsWith("/images/") ||
        customLogo.startsWith("data:") ||
        customLogo.startsWith("http://") ||
        customLogo.startsWith("https://")));

  const imageToShow = logoIsImage ? logo : customLogo;

  const variantClasses = {
    default: "border border-gray-200 shadow-sm",
    sleek:
      "border border-gray-100 shadow-md ring-1 ring-black/5 backdrop-blur-sm",
    minimal: "border-0 shadow-none",
    glow: "border border-white/20 shadow-lg shadow-primary/20 ring-2 ring-primary/10",
  };

  const containerBase = cn(
    sizeClasses[size],
    "rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300",
    variantClasses[variant],
    className,
  );

  if (showCustomLogo && imageToShow) {
    return (
      <div className={cn(containerBase, "bg-white p-0.5")}>
        <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <img
            src={imageToShow}
            alt="Venue logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    );
  }

  // Default fallback with icon (no emoji support for venues)
  return (
    <div
      className={cn(
        containerBase,
        "bg-gradient-to-br from-gray-100 to-gray-50",
      )}
    >
      <Store className={cn(iconSizeClasses[size], "text-gray-400")} />
    </div>
  );
};

// New sleek logo frame component for enhanced visuals
interface LogoFrameProps {
  src?: string;
  alt?: string;
  fallbackIcon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "sleek" | "glass" | "elevated" | "bordered";
  className?: string;
}

export const LogoFrame: React.FC<LogoFrameProps> = ({
  src,
  alt = "Logo",
  fallbackIcon,
  size = "md",
  variant = "sleek",
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const variantStyles = {
    default: "bg-white border border-gray-200 shadow-sm",
    sleek:
      "bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md ring-1 ring-black/5",
    glass: "bg-white/80 backdrop-blur-md border border-white/40 shadow-lg",
    elevated: "bg-white shadow-xl shadow-gray-200/50 border-0",
    bordered: "bg-white border-2 border-gray-200 shadow-none",
  };

  const showImage = src && !imageError;

  return (
    <div
      className={cn(
        sizeClasses[size],
        variantStyles[variant],
        "rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:shadow-lg hover:scale-105",
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        fallbackIcon || (
          <Store className={cn(iconSizes[size], "text-gray-400")} />
        )
      )}
    </div>
  );
};
