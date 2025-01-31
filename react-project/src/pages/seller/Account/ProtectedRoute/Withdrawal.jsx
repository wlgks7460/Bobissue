import React, { useState } from 'react'
import './Info.css' // 스타일 재사용

const Withdrawal = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    reason: '',
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 가상 백엔드 응답 (디버깅용)
    const response = {
      ok: true,
      json: () => Promise.resolve({ message: '회원 탈퇴가 완료되었습니다.' }),
    }

    if (response.ok) {
      const data = await response.json()
      alert(data.message) // 성공 메시지
      setFormData({ email: '', password: '', reason: '' }) // 입력값 초기화
      setMessage('')
    } else {
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.') // 실패 메시지
    }
  }

  return (
    <div className='info-container'>
      <h2>회원 탈퇴</h2>
      <form onSubmit={handleSubmit} className='info-form'>
        <div className='info-item'>
          <label htmlFor='email'>이메일:</label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='이메일을 입력하세요'
            required
          />
        </div>
        <div className='info-item'>
          <label htmlFor='password'>비밀번호:</label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='비밀번호를 입력하세요'
            required
          />
        </div>
        <div className='info-item'>
          <label htmlFor='reason'>탈퇴 사유:</label>
          <select
            id='reason'
            name='reason'
            value={formData.reason}
            onChange={handleChange}
            required
          >
            <option value=''>선택해주세요</option>
            <option value='서비스가 필요없음'>서비스가 필요없음</option>
            <option value='복잡한 사용 과정'>복잡한 사용 과정</option>
            <option value='개인정보 문제'>개인정보 문제</option>
            <option value='기타'>기타</option>
          </select>
        </div>
        <button type='submit' className='info-button'>
          탈퇴하기
        </button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  )
}

export default Withdrawal
