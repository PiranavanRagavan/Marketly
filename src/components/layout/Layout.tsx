import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onSearchChange?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearchChange }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header onSearchChange={onSearchChange} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
