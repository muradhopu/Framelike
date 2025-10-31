
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <h1 className="text-2xl font-bold text-primary">FrameLink</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
