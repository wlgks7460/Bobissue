import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Info.css' // 동일한 CSS 파일 사용

const Update_Info = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  // 더미 데이터로 초기값 설정
  useEffect(() => {
    const dummyData = {
      name: '홍길동',
      email: 'hong@example.com',
      phone: '010-1234-5678',
    }
    setFormData(dummyData)
  }, [])

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 디버깅용 가상 응답
    const response = {
      ok: true, // 항상 성공하도록 설정
      json: () => Promise.resolve({ message: '개인정보가 성공적으로 업데이트되었습니다.' }),
    }

    if (response.ok) {
      const data = await response.json()
      alert(data.message) // 성공 시 알림 표시
      navigate('/seller/account/info') // 성공 시 이동
    } else {
      alert('개인정보 업데이트에 실패했습니다.') // 실패 시 알림 표시
    }
  }

  return (
    <div className='info-container'>
      <h2>개인정보 수정</h2>
      <form onSubmit={handleSubmit} className='info-form'>
        <div className='info-item'>
          <label htmlFor='name'>이름:</label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='info-item'>
          <label htmlFor='email'>이메일:</label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='info-item'>
          <label htmlFor='phone'>전화번호:</label>
          <input
            type='tel'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type='submit' className='info-button'>
          수정하기
        </button>
      </form>
    </div>
  )
}

export default Update_Info
