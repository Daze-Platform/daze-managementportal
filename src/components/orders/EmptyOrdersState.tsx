import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Play, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyOrdersStateProps {
  onResumeOrders: () => void;
}

export const EmptyOrdersState = ({ onResumeOrders }: EmptyOrdersStateProps) => {
  return (
    <div className="h-full flex items-center justify-center bg-black p-8">
      <Card className="max-w-md w-full text-center border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-8">
          {/* Illustration */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <div className="text-4xl animate-pulse">📋</div>
            </div>
            {/* Floating icons */}
            <div className="absolute top-0 left-1/4 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-bounce shadow-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="absolute top-4 right-1/4 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center animate-bounce delay-150 shadow-sm">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>

          {/* Main heading */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            All caught up! 🎉
          </h3>

          {/* Subheading */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            No new orders at the moment. Your store is currently paused from
            receiving new orders.
          </p>

          {/* Status info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-700">
                Store is paused
              </span>
            </div>
            <p className="text-xs text-red-600">
              You're not taking orders right now
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                console.log("Resume Taking Orders clicked in EmptyOrdersState");
                onResumeOrders();
              }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume Taking Orders
            </Button>

            <Link to="/settings" className="block w-full">
              <Button variant="outline" className="w-full hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                Store Settings
              </Button>
            </Link>
          </div>

          {/* Help text */}
          <p className="text-xs text-gray-500 mt-4">
            Need help? Check your{" "}
            <Link
              to="/settings"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              store settings
            </Link>{" "}
            or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
