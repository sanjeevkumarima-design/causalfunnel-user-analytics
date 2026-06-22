import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, onRefresh, lastUpdated }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="lg:ml-64">
        <Header onRefresh={onRefresh} lastUpdated={lastUpdated} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
