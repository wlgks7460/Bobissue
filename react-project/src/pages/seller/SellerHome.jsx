import React, { useState, useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';

const SellerMainPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null); // token 상태를 useState로 관리
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

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 로그인 여부를 확인하고 리디렉션 처리
  useEffect(() => {
    let savedToken = localStorage.getItem('SELLER_AUTH_TOKEN');
     savedToken ="hello"
    if (!savedToken) {
      //더미토큰 디버깅용
      setToken(savedToken)
      navigate('/seller/login', { replace: true }); // 로그인 페이지로 리디렉션
    } else {
      setToken(savedToken); // 토큰 상태 업데이트
    }
  },[navigate]);

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

  // 로그인 상태가 확인될 때까지 컴포넌트 렌더링 방지
  // if (token) {
  //   return null; // 로그인 상태를 확인할 때까지 아무것도 렌더링하지 않음
  // }

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
          className={`p-6 bg-gray-50 transition-all duration-300 ${sidebarOpen ? 'lg:ml-32' : ''}`}
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
