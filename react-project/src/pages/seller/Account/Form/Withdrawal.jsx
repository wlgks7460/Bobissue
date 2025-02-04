import React, { useState } from 'react'
import API from '@/utils/API'

const Withdrawal = ({ userInfo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 열기/닫기
  const [loading, setLoading] = useState(false) // 로딩 상태
  const [error, setError] = useState('') // 에러 상태

  const handleDelete = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('SELLER_AUTH_TOKEN')
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      // API를 통해 계정 탈퇴 요청
      const response = await API.delete(`/sellers/${userInfo.sellerNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200) {
        alert('계정이 성공적으로 삭제되었습니다.')
        // 탈퇴 후 적절한 리다이렉션 또는 로그아웃 처리
        window.location.href = '/seller/login' // 예시: 로그인 페이지로 리다이렉션
      }
    } catch (err) {
      setError(err.message) // 에러 처리
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* 탈퇴 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
      >
        계정 탈퇴
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg w-[400px]'>
            <h2 className='text-xl font-bold mb-4'>정말 계정을 탈퇴하시겠습니까?</h2>
            {error && <p className='text-red-500'>{error}</p>}
            <div className='flex justify-between mt-4'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='p-2 bg-gray-300 text-black rounded-md hover:bg-gray-400'
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className='p-2 bg-red-500 text-white rounded-md hover:bg-red-600'
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg'>
            <p>삭제 중...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Withdrawal
