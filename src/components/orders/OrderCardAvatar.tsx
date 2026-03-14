import React from "react";

interface OrderCardAvatarProps {
  customer?: string;
}

export const OrderCardAvatar = ({ customer }: OrderCardAvatarProps) => {
  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "GU"
    );
  };

  return (
    <div className="relative flex-shrink-0">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md ring-1 ring-black/5">
        <span className="text-white font-bold text-sm">
          {getInitials(customer || "")}
        </span>
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
    </div>
  );
};
