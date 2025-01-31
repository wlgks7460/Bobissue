import React, { useState } from 'react'
import './Info.css' // 동일한 CSS 파일 사용
import { useNavigate } from 'react-router-dom'

const Update_Password = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [backendPassword] = useState('secure1234') // 가상의 현재 비밀번호
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 새 비밀번호와 백엔드 비밀번호가 같은지 확인
    if (newPassword === backendPassword) {
      setMessage('새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.')
      return
    }

    // 새 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (newPassword !== confirmPassword) {
      console.log(newPassword)
      console.log(confirmPassword)
      setMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
      return
    }

    // 비밀번호 업데이트 요청 (디버깅용 가상 응답)
    const response = {
      ok: true,
      json: () => Promise.resolve({ message: '비밀번호가 성공적으로 업데이트되었습니다.' }),
    }

    if (response.ok) {
      const data = await response.json()
      alert(data.message) // 성공 메시지
      setMessage('')
      setNewPassword('')
      setConfirmPassword('')
      Navigate('/seller/account/info')
    } else {
      alert('비밀번호 업데이트에 실패했습니다.')
    }
  }

  return (
    <div className='info-container'>
      <h2>비밀번호 수정</h2>
      <form onSubmit={handleSubmit} className='info-form'>
        <div className='info-item'>
          <label htmlFor='newPassword'>새 비밀번호:</label>
          <input
            type='password'
            id='newPassword'
            name='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className='info-item'>
          <label htmlFor='confirmPassword'>새 비밀번호 확인:</label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='info-button'>
          수정하기
        </button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  )
}

export default Update_Password
