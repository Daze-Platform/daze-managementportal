
import React from 'react';

interface StoreLogoProps {
  logo: string;
  customLogo?: string;
  bgColor: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StoreLogo = ({ logo, customLogo, bgColor, size = 'md', className = '' }: StoreLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-10 sm:h-10',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-12 h-12 sm:w-16 sm:h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl'
  };

  // Check if logo is an image path (not emoji)
  const logoIsImage = logo && (
    logo.startsWith('/images/') ||
    logo.startsWith('/lovable-uploads/') ||
    logo.startsWith('http://') ||
    logo.startsWith('https://')
  );

  // Only show custom logo if it's a real user upload (not stock image)
  const showCustomLogo = logoIsImage || (!!customLogo && (
    customLogo.startsWith('/lovable-uploads/') || 
    customLogo.startsWith('/public/lovable-uploads/') ||
    customLogo.startsWith('/images/') ||
    customLogo.startsWith('data:') || // Base64 encoded images
    customLogo.startsWith('http://') ||
    customLogo.startsWith('https://')
  ));

  const imageToShow = logoIsImage ? logo : customLogo;

  return (
    <div className={`${sizeClasses[size]} ${showCustomLogo ? 'bg-white' : bgColor} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200 ${className}`}>
      {showCustomLogo ? (
        <img 
          src={imageToShow} 
          alt="Store logo" 
          className="w-full h-full object-contain p-1"
        />
      ) : (
        <span className={`text-white ${textSizeClasses[size]}`}>{logo}</span>
      )}
    </div>
  );
};
