import React, { useState, useEffect } from 'react'
import TopNavbar from './components/TopNavbar'
import Sidebar from './components/Sidebar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const SellerMainPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(null)
  const [menuState, setMenuState] = useState({
    product: false,
    delivery: false,
    settlement: false,
    sellerInfo: false,
    inquiry: false,
    liveCommerce: false,
    salesStats: false,
    notices: false,
  })

  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('SELLER_AUTH_TOKEN')

    if (!savedToken) {
      const redirectPath = `${location.pathname}${location.search}`
      navigate(`/seller/login?path=${encodeURIComponent(redirectPath)}`, { replace: true })
    } else {
      setToken(savedToken)
    }
  }, [navigate, location.pathname, location.search])

  const toggleMenu = (menu) => {
    setMenuState((prevState) => {
      const updatedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === menu ? !prevState[key] : false
        return acc
      }, {})
      return updatedState
    })
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className='flex flex-col min-h-screen bg-white border border-gray-300'>
      {/* Top Navbar (Sticky 적용) */}
      <div className='fixed top-0 z-50 w-full h-16 bg-white border-b border-gray-300'>
        <TopNavbar toggleSidebar={toggleSidebar} />
      </div>

      <div className='flex flex-1 mt-16 min-h-[calc(100vh-64px)]'>
        {/* Sidebar (탑 메뉴바 아래로 배치, 슬라이딩 효과 적용) */}
        <div
          className={`fixed left-0 top-16 h-[calc(100%-64px)] z-40 transition-transform duration-300 ease-in-out bg-white border-r border-gray-300
            ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
          `}
        >
          <Sidebar isOpen={sidebarOpen} toggleMenu={toggleMenu} menuState={menuState} />
        </div>

        {/* Main Content (Sidebar가 열릴 때 밀려나도록 조정) */}
        <main
          className={`flex-1 p-2  transition-all relative duration-300 mt-2 min-h-[calc(80vh-32px)] ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
        >
          <Outlet />
        </main>
      </div>

      {/* Footer (스크롤 시 항상 바닥에 고정) */}
      <footer className='w-full text-center py-4 bg-gray-100 text-gray-600 text-sm border-t border-gray-300 mt-auto'>
        &copy; 2025 판매자 플랫폼. 모든 권리 보유.
      </footer>
    </div>
  )
}

export default SellerMainPage
