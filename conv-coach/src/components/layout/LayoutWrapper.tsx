import React from 'react';
import AppFooter from './AppFooter';

interface LayoutWrapperProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  showFooter = true
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && (
        <div className="flex-shrink-0">
          <AppFooter />
        </div>
      )}
    </div>
  );
};

export default LayoutWrapper;