import React, { useState, useEffect } from 'react'
import TopNavbar from './components/TopNavbar'
import Sidebar from './components/Sidebar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import API from '@/utils/API' // API 호출 모듈

const SellerMainPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [registration, setRegistration] = useState(false) // 회사 등록 여부
  const [token, setToken] = useState(null)
  const debug_mode = true // ✅ 디버그 모드 설정
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [menuState, setMenuState] = useState({
    product: false,
    delivery: false,
    settlement: false,
    sellerInfo: false,
    inquiry: false,
    liveCommerce: false,
    salesStats: false,
    company: false,
    notices: false,
  })

  // ✅ 회사 등록 여부 확인 (비동기)
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (debug_mode) {
        setTimeout(() => {
          setRegistration(false) // 🔹 필요에 따라 true 또는 false 변경
        }, 500)
      } else {
        try {
          const response = await API.get('/company')
          setRegistration(response.data?.isRegistered || false)
        } catch (error) {
          console.error('회사 등록 여부 확인 실패:', error)
          setRegistration(false)
        }
      }
    }

    fetchCompanyData()
  }, [debug_mode])

  // ✅ 로그인 상태 확인
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token')

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
    <>
      {/* ✅ 회사가 등록되지 않았을 경우 안내 페이지 표시 */}
      {!registration ? (
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100 p-8'>
          <h1 className='text-2xl font-semibold text-gray-800'>회사 등록 필요</h1>
          <p className='text-gray-600 mt-2'>판매자로 활동하기 위해 회사를 등록하세요.</p>
          <button
            onClick={() => navigate('/seller/company/register')}
            className='mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition'
          >
            회사 등록하기
          </button>
        </div>
      ) : (
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
              className={`flex-1 p-2 transition-all relative duration-300 mt-2 min-h-[calc(80vh-32px)] ${
                sidebarOpen ? 'ml-64' : 'ml-0'
              }`}
            >
              <Outlet />
            </main>
          </div>

          {/* Footer (스크롤 시 항상 바닥에 고정) */}
          <footer className='w-full text-center py-4 bg-gray-100 text-gray-600 text-sm border-t border-gray-300 mt-auto'>
            &copy; 2025 판매자 플랫폼. 모든 권리 보유.
          </footer>
        </div>
      )}
    </>
  )
}

export default SellerMainPage
