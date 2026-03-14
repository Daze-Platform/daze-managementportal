import React from "react";

const Index = () => {
  console.log("Index component is rendering");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Welcome to Your App
        </h1>
        <p className="text-xl text-gray-600">
          The interface is now loading properly!
        </p>
      </div>
    </div>
  );
};

export default Index;
