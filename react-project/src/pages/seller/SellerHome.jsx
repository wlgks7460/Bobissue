import React, { useState } from 'react';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';

const SellerMainPage = () => {
  const [menuState, setMenuState] = useState({
    product: false,
    delivery: false,
    settlement: false,
    sellerInfo: false,
    inquiry: false,
    liveCommerce: false,
    salesStats: false,
    notices: false,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleMenu = (menu) => {
    setMenuState((prevState) => {
      const updatedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === menu ? !prevState[key] : false;
        return acc;
      }, {});
      return updatedState;
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navbar */}
      <TopNavbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar isOpen={sidebarOpen} toggleMenu={toggleMenu} menuState={menuState} />
        )}
        {/* Main Content */}
        <main
          className={` p-6 bg-gray-50 transition-all duration-300 lg:ml-32`}
        >
          <Outlet />
        </main>
      </div>
      {/* Footer */}
      <footer className="text-center py-4 bg-gray-100 text-gray-600 text-sm border-t">
        &copy; 2025 판매자 플랫폼. 모든 권리 보유.
      </footer>
    </div>
  );
};

export default SellerMainPage;
