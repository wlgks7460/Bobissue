import React, { useEffect, useState } from 'react'
import './Info.css' // CSS 파일 추가

const Info = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserInfo = async () => {
      // JWT 토큰 가져오기
      const token = localStorage.getItem('authToken')

      // 디버깅용 가상 응답
      const response = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: '12345',
            name: '홍길동',
            email: 'hong@example.com',
            createdAt: '2022-01-01T12:00:00Z',
          }),
      }

      if (response.ok) {
        const data = await response.json()
        setUserInfo(data) // 사용자 정보 설정
      } else {
        setError('사용자 정보를 불러올 수 없습니다.')
      }
    }

    fetchUserInfo()
  }, [])

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  if (!userInfo) {
    return <p>로딩 중...</p> // 데이터가 로드될 때까지 로딩 표시
  }

  return (
    <div className='info-container'>
      <h2>사용자 정보</h2>
      <div className='info-item'>
        <label>아이디:</label>
        <span>{userInfo.id}</span>
      </div>
      <div className='info-item'>
        <label>이름:</label>
        <span>{userInfo.name}</span>
      </div>
      <div className='info-item'>
        <label>이메일:</label>
        <span>{userInfo.email}</span>
      </div>
      <div className='info-item'>
        <label>가입일:</label>
        <span>{userInfo.createdAt}</span>
      </div>
    </div>
  )
}

export default Info
