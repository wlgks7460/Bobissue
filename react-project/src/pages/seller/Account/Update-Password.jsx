import React, { useState, useEffect } from 'react'
import API from '@/utils/API'
import Info from './Form/Info'
import UpdateInfo from './Form/Update_Info'
import Withdrawal from './Form/Withdrawal'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const VenderInfo = () => {
  const debug_mode = localStorage.getItem('debug_mode') === 'true' // ✅ 디버그 모드 활성화 여부
  const navigate = useNavigate()
  
  // ✅ 디버그 모드용 더미 데이터
  const dummyData = {
    sellerNo: 1,
    name: '판매자2',
    email: 'seller@naver.com',
    company: {
      name: '주식회사우리',
      license: 'license1',
      status: 'Y',
      bank: '광주은행',
      bankAccount: '007121112675',
    },
    callNumber: '010-1234-5678',
    status: 'Y',
    approvalStatus: 'Y',
  }

  // ✅ 상태 관리
  const [userInfo, setUserInfo] = useState(debug_mode ? dummyData : null)
  const [loading, setLoading] = useState(!debug_mode)
  const [error, setError] = useState('')
  const [isUpdatePage, setIsUpdatePage] = useState(false)

  // ✅ 사용자 정보 가져오기
  useEffect(() => {
    if (debug_mode) {
      setUserInfo(dummyData)
      setLoading(false)
      return
    }

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('인증 토큰이 없습니다.')

        const response = await API.get('/sellers/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log(response)
        if (response.status === 200) {
          setUserInfo(response.data?.result?.data || dummyData)
        } else {
          throw new Error('서버에서 데이터를 가져오는 데 실패했습니다.')
        }
      } catch (err) {
        setError(err.message)
        setUserInfo(dummyData) // 실패 시 더미 데이터 사용 가능
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [isUpdatePage])

  // ✅ 로딩 화면 처리
  if (loading)
    return (
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <Loader2 className='animate-spin w-12 h-12 text-gray-500' />
      </div>
    )

  return (
    <div className='flex flex-col justify-center items-center bg-white min-h-screen p-6'>
      <div className='w-full max-w-2xl bg-white shadow-lg p-8 rounded-xl border border-gray-300'>
        {/* ✅ 페이지 상태에 따라 컴포넌트 렌더링 */}
        {isUpdatePage ? (
          <UpdateInfo
            userInfo={userInfo}
            onSave={(updatedInfo) => {
              setUserInfo((prev) => ({ ...prev, ...updatedInfo }))
              setIsUpdatePage(false)
            }}
            onClose={() => setIsUpdatePage(false)}
          />
        ) : (
          <Info userInfo={userInfo} />
        )}

        {/* ✅ 버튼 그룹 */}
        <div className='mt-6 flex justify-center space-x-4'>
          {!isUpdatePage && (
            <>
              {/* 개인정보 수정 버튼 */}
              <button
                onClick={() => setIsUpdatePage(true)}
                className='px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-all shadow-md'
              >
                개인정보 수정
              </button>

              {/* 사업자 정보 수정 버튼 */}
              <button
                onClick={() => navigate('/seller/company/update')}
                className='px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500 transition-all shadow-md'
              >
                회사정보수정
              </button>
            </>
          )}
        </div>

        {/* ✅ 오류 메시지 출력 */}
        {error && <p className='mt-4 text-center text-gray-700 animate-fade-in'>{error}</p>}

        {/* ✅ 판매자 탈퇴 컴포넌트 */}
        <div className='mt-8'>
          <Withdrawal userInfo={userInfo} />
        </div>
      </div>
    </div>
  )
}

export default VenderInfo
