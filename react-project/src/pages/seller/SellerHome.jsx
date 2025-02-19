import React, { useState, useEffect } from 'react'
import TopNavbar from './components/TopNavbar'
import Sidebar from './components/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import API from '@/utils/API' // API 호출 모듈

const SellerMainPage = () => {
  const debug_mode = false
  const navigate = useNavigate()
  const [registration, setRegistration] = useState('N') // ✅ null: 아직 확인되지 않음
  const [token, setToken] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [user, setUser] = useState(null) // ✅ 초기값 null로 변경
  const [select, setSelect] = useState(null)

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

  // ✅ 1. 로그인 상태 확인
  useEffect(() => {
    if (debug_mode) {
      return
    }
    const savedToken = localStorage.getItem('access_token')
    if (!savedToken) {
      navigate('/seller/login')
    } else {
      setToken(savedToken)
    }
  }, [navigate])

  useEffect(() => {
    if (debug_mode) return
    if (!token) return
    //console.log('hello');
    const fetchUserStatus = async () => {
      try {
        const response = await API.get('/sellers/profile')
        console.log(response.data.result.data)
        setUser(response?.data?.result?.data || null) // ✅ 전체 유저 객체 저장
        setRegistration(response.data.result.data.company)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUserStatus()
  }, [token])

 

  const toggleMenu = (menu) => {
    setMenuState((prevState) => {
      return Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === menu ? !prevState[key] : false
        return acc
      }, {})
    })
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')

    navigate('/seller/login')
  }

  // ✅ 로그인 상태 확인 중에는 로딩 화면 표시
  if (token === null || registration === 'N') {
    return <div className='flex items-center justify-center min-h-screen'>로딩 중...</div>
  }

  return (
    <div className=''>
      {/* <button
        className='flex items-center justify-center mt-[80px]'
        onClick={() => setDebug_mode(!debug_mode)}
      >
        {debug_mode ? '로그인페이지 디버깅중' : '디버깅X'}
      </button> */}
      {!debug_mode ? (
        registration === 'N' ? (
          <div className='flex flex-col items-center justify-center min-h-screen'>
            <p className='text-lg font-medium'>회사 정보 확인 중...</p>
            <button
              onClick={handleLogout}
              className='mt-4 px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition'
            >
              로그아웃
            </button>
          </div>
        ) : registration===null ? (
          <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100 p-8'>
            <h1 className='text-2xl font-semibold text-gray-800'>회사 등록 필요</h1>
            <p className='text-gray-600 mt-2'>판매자로 활동하기 위해 회사를 등록하세요.</p>
            <button
              onClick={() => navigate('/seller/company/register')}
              className='mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition'
            >
              회사 등록하기
            </button>
            <button
              onClick={() => {
                handleLogout()
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className='flex flex-col min-h-screen bg-white border border-gray-300'>
            {/* Top Navbar */}
            <div className='fixed top-0 z-50 w-full h-16 bg-gray-100 border-b border-gray-300'>
              <TopNavbar
                toggleSidebar={toggleSidebar}
                select={select}
                setSelect={setSelect}
                user={user}
              />
            </div>

            <div className='flex flex-1 mt-16 min-h-[calc(100vh-64px)]'>
              {/* Sidebar */}
              <div
                className={`fixed left-0 top-16 h-[calc(100%-64px)] z-40 transition-transform duration-300 ease-in-out bg-white border-r border-gray-300
                ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}`}
              >
                <Sidebar
                  isOpen={sidebarOpen}
                  toggleMenu={toggleMenu}
                  select={select}
                  setSelect={setSelect}
                  menuState={menuState}
                  companyNo={registration}
                />
              </div>

              {/* Main Content */}
              <main
                className={`flex-1 p-2 transition-all relative duration-300 mt-2 min-h-[calc(80vh-32px)] ${
                  sidebarOpen ? 'ml-64' : 'ml-0'
                }`}
              >
                <Outlet context={{ companyNo: registration }} />
              </main>
            </div>

            {/* Footer */}
            <footer className='w-full text-center py-4 bg-gray-100 text-gray-600 text-sm border-t border-gray-300 mt-auto'>
              &copy; 2025 BOBISSUE. All rights reserved.
            </footer>
          </div>
        )
      ) : (
        <div className='flex flex-col min-h-screen bg-white border border-gray-300'>
          {/* Top Navbar */}
          <div className='fixed top-0 z-50 w-full h-16 bg-gray-100 border-b border-gray-300'>
            <TopNavbar
              toggleSidebar={toggleSidebar}
              user={user}
              select={select}
              setSelect={setSelect}
            />
          </div>

          <div className='flex flex-1 mt-16 min-h-[calc(100vh-64px)]'>
            {/* Sidebar */}
            <div
              className={`fixed left-0 top-16 h-[calc(100%-64px)] z-40 transition-transform duration-300 ease-in-out bg-white border-r border-gray-300
              ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}`}
            >
              <Sidebar
                isOpen={sidebarOpen}
                toggleMenu={toggleMenu}
                select={select}
                setSelect={setSelect}
                menuState={menuState}
              />
            </div>

            {/* Main Content */}
            <main
              className={`w-full z-1 flex-1 p-2 transition-all relative duration-300 mt-[8px] min-h-[calc(80vh-30px)] ${
                sidebarOpen ? 'ml-64' : 'ml-0'
              }`}
            >
              <Outlet />
            </main>
          </div>

          {/* Footer */}
          <footer className='w-full text-center py-4 bg-gray-100 text-gray-600 text-sm border-t border-gray-300 mt-auto'>
            &copy; 2025 BOBISSUE. All rights reserved.
          </footer>
        </div>
      )}
    </div>
  )
}

export default SellerMainPage
