import React from 'react';
import { Link } from 'react-router-dom';

const TopNavbar = ({ toggleSidebar }) => {
  return (
    <nav className="flex items-center justify-between bg-gray-100 px-4 py-3 shadow-md relative z-50">
      {/* 햄버거 버튼 */}
      
      <button
        onClick={toggleSidebar}
        className=" text-gray-600 p-2 rounded-md hover:bg-gray-200 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <svg
          fill="none"
          strokeWidth={1.5}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      

      {/* 로고 이미지 */}
    
      <Link to="">
        <img
          src="/path/to/your/image.png"
          alt="이미지"
          className="w-12 h-12 object-cover cursor-pointer"
        />
      </Link>

      {/* 홈 링크 */}

      <Link
        to="/"
        className="ml-auto text-sm text-indigo-600 no-underline hover:underline focus:underline"
      >
        Home
      </Link>
    </nav>
  );
};

export default TopNavbar;
