import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation, Outlet } from 'react-router-dom'

const PasswordVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const redirectPath = location.pathname // 기본값 설정
  const token = localStorage.getItem('VerificationToken')
  // console.log(location)
  // 컴포넌트 로드 시 로컬스토리지 확인
  useEffect(() => {
    if (token) {
      // 토큰이 있으면 리다이렉트 경로로 이동
      navigate(redirectPath)
    } else {
      navigate(`/seller/account/verification/?redirect=${redirectPath}`)
    }
  }, [navigate, token, redirectPath])

  // const handleSubmit = async (e) => {
  //   e.preventDefault()

  //   // 디버깅용 가상 응답
  //   const response = { ok: true, json: () => Promise.resolve({ token: 'debug-token' }) }

  //   if (response.ok) {
  //     const data = await response.json()
  //     const { token } = data

  //     // 토큰 저장
  //     localStorage.setItem('VerificationToken', token)

  //     // 성공 시 리다이렉트 경로로 이동
  //     navigate(`/seller/account/${redirectPath}`)
  //   } else {
  //     navigate('/seller/account/verification')
  //   }
  // }

  return <Outlet />
  // (
  //     <div className='flex items-center justify-center min-h-screen bg-gray-100'>
  //       <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-6 rounded-lg shadow-md'>
  //         <h2 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>비밀번호 확인</h2>
  //         <div className='mb-4'>
  //           <input
  //             type='password'
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             placeholder='비밀번호를 입력하세요'
  //             required
  //             className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
  //           />
  //         </div>
  //         {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
  //         <button
  //           type='submit'
  //           className='w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
  //         >
  //           제출
  //         </button>
  //       </form>
  //     </div>
  //   )
}

export default PasswordVerification
