import React, { useState, useEffect } from 'react'
import API from '@/utils/API'
import Info from './Form/Info'
import UpdateInfo from './Form/Update_Info'
import Withdrawal from './Form/Withdrawal'

const VenderInfo = () => {
  const dummyData = {
    sellerNo: '12345',
    name: '홍길동',
    email: 'hong@example.com',
    company: {
      name: '홍길동 회사',
      license: '123-45-67890',
      status: 'Y',
    },
    callNumber: '010-1234-5678',
  }

  const [userInfo, setUserInfo] = useState(dummyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUpdatePage, setIsUpdatePage] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          throw new Error('인증 토큰이 없습니다.')
        }

        const response = await API.get('/sellers/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 200) {
          const data = response.data
          if (data.status === 'OK' && data.result) {
            setUserInfo(data.result)
          } else {
            setUserInfo(dummyData)
          }
        } else {
          throw new Error('서버 오류가 발생했습니다.')
        }
        //dummy
        setUserInfo(dummyData)
      } catch (err) {
        setError(err.message)
        setUserInfo(dummyData)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [isUpdatePage])

  if (loading) {
    return <p>로딩 중...</p>
  }

  const handleSave = async (updatedInfo) => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      // API로 수정된 데이터 전송
      const response = await API.put(`/sellers/${updatedInfo.sellerNo}`, updatedInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200) {
        setUserInfo(response.data.result)
        setIsUpdatePage(false) // 수정 후 Info 페이지로 돌아가기
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      {isUpdatePage ? (
        <UpdateInfo userInfo={userInfo} onSave={handleSave} />
      ) : (
        <Info userInfo={userInfo} />
      )}

      <div className='mt-4'>
        {/* 수정 페이지가 아니면 '개인정보 수정' 버튼을 보여줌 */}
        {!isUpdatePage && (
          <button
            onClick={() => setIsUpdatePage(true)}
            className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            개인정보 수정
          </button>
        )}
      </div>

      <div className='mt-6'>
        {/* Withdrawal 컴포넌트를 여기서 추가 */}
        <Withdrawal userInfo={userInfo} />
      </div>
    </div>
  )
}

export default VenderInfo
