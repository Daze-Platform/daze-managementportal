import React from "react";
import { User } from "lucide-react";

interface OrderCardCustomerProps {
  customer?: string;
}

export const OrderCardCustomer = ({ customer }: OrderCardCustomerProps) => {
  if (!customer) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3 mb-3 p-2.5 bg-gray-50/50 rounded-lg border border-gray-50">
      <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white text-xs font-semibold shadow-sm ring-1 ring-black/5">
        {getInitials(customer)}
      </div>
      <span className="text-sm font-medium text-gray-800">{customer}</span>
    </div>
  );
};
