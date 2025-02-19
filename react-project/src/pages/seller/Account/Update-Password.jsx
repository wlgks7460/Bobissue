import React, { useState } from 'react'
import API from '@/utils/API'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const UpdatePassword = () => {
  const navigate = useNavigate()

  // ✅ 상태 관리
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const debug_mode = true

  // ✅ 비밀번호 변경 요청
  const handlePasswordUpdate = async () => {
    if (debug_mode) {
      alert('비밀번호 변경이 완료되었습니다.')
      navigate('/seller/account/verification')
      return
    }
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return setError('모든 필드를 입력해주세요.')
    }
    if (newPassword !== confirmPassword) {
      return setError('새 비밀번호가 일치하지 않습니다.')
    }
    if (newPassword.length < 8) {
      return setError('비밀번호는 최소 8자 이상이어야 합니다.')
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('인증 토큰이 없습니다.')

      const response = await API.put('/change-password', { currentPassword, newPassword })

      if (response.status === 200) {
        setSuccess('비밀번호가 성공적으로 변경되었습니다!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        throw new Error('비밀번호 변경에 실패했습니다.')
      }
    } catch (err) {
      setError(err.message || '비밀번호 변경 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center bg-warmBeige/20 min-h-screen p-6'>
      <div className='w-full max-w-md bg-white shadow-lg p-8 rounded-xl border border-caramelTan'>
        <h2 className='text-2xl font-bold text-espressoBlack text-center mb-6'>비밀번호 변경</h2>

        {/* ✅ 현재 비밀번호 입력 */}
        <label className='block text-lg font-medium text-darkGraphite mb-2'>현재 비밀번호</label>
        <input
          type='password'
          className='border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-caramelTan'
          placeholder='현재 비밀번호 입력'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        {/* ✅ 새 비밀번호 입력 */}
        <label className='block text-lg font-medium text-darkGraphite mt-4 mb-2'>새 비밀번호</label>
        <input
          type='password'
          className='border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-caramelTan'
          placeholder='새 비밀번호 입력'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {/* ✅ 새 비밀번호 확인 */}
        <label className='block text-lg font-medium text-darkGraphite mt-4 mb-2'>
          새 비밀번호 확인
        </label>
        <input
          type='password'
          className='border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-caramelTan'
          placeholder='새 비밀번호 재입력'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* ✅ 오류 메시지 출력 */}
        {error && <p className='mt-4 text-center text-roastedCocoa'>{error}</p>}

        {/* ✅ 성공 메시지 출력 */}
        {success && <p className='mt-4 text-center text-coffeeBrown font-semibold'>{success}</p>}

        {/* ✅ 버튼 그룹 */}
        <div className='mt-6 flex justify-center space-x-4'>
          <button
            onClick={handlePasswordUpdate}
            className='px-4 py-2 text-white bg-coffeeBrown rounded-lg hover:bg-mochaBrown transition-all shadow-md'
            disabled={loading}
          >
            {loading ? <Loader2 className='animate-spin w-5 h-5 inline-block' /> : '비밀번호 변경'}
          </button>

          <button
            onClick={() => navigate('/seller')}
            className='px-4 py-2 text-darkGraphite bg-latteBeige rounded-lg hover:bg-caramelTan transition-all shadow-md'
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdatePassword
