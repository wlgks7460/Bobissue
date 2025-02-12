import { useEffect, useState } from 'react'
import API from '@/utils/API' // ✅ API 유틸리티 임포트
import Button from '../../../components/ui/Button' // ✅ 버튼 컴포넌트 활용

const Append = () => {
  const debug_mode = false // ✅ 디버그 모드 (true일 경우 API 요청 실행 X)
  const [extraAccounts, setExtraAccounts] = useState([]) // ✅ 추가 계정 리스트
  const [newAccount, setNewAccount] = useState({
    email: '',
    password: '',
    callNumber: '',
    name: '',
  })

  // ✅ 계정 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewAccount({ ...newAccount, [name]: value })
  }

  // ✅ 추가 계정 리스트에 계정 추가
  const handleAddAccount = () => {
    if (!newAccount.email || !newAccount.password || !newAccount.callNumber || !newAccount.name) {
      alert('모든 필드를 입력해주세요.')
      return
    }
    setExtraAccounts([...extraAccounts, newAccount]) // 기존 리스트에 추가
    setNewAccount({ email: '', password: '', callNumber: '', name: '' }) // 입력값 초기화
  }

  // ✅ 추가 계정 삭제
  const handleDeleteAccount = (index) => {
    setExtraAccounts(extraAccounts.filter((_, i) => i !== index))
  }

  // ✅ API로 추가 계정 리스트 전송
  async function handleSubmit() {
    if (debug_mode) {
      console.log('Debug Mode: 데이터 전송 생략됨.', extraAccounts)
      return
    }

    try {
      console.log(extraAccounts)
      const response = await API.post('/sellers/extra-accounts', extraAccounts)
      if (response.status === 200) {
        alert('✅ 추가 계정이 성공적으로 등록되었습니다!')
        setExtraAccounts([]) // 전송 후 리스트 초기화
      }
    } catch (error) {
      console.error('❌ 계정 추가 실패:', error)
      alert('❌ 계정 추가 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className='p-6 max-w-3xl'>
      <h2 className='text-2xl font-semibold mb-4'>추가 계정 관리</h2>

      {/* ✅ 입력 폼 */}
      <div className='bg-white rounded-lg p-4 mb-4'>
        <div className='grid grid-cols-2 gap-4 mb-2'>
          <input
            type='email'
            name='email'
            value={newAccount.email}
            onChange={handleInputChange}
            placeholder='이메일'
            className='border p-2 rounded'
            required
          />
          <input
            type='password'
            name='password'
            value={newAccount.password}
            onChange={handleInputChange}
            placeholder='비밀번호'
            className='border p-2 rounded'
            required
          />
        </div>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <input
            type='text'
            name='callNumber'
            value={newAccount.callNumber}
            onChange={handleInputChange}
            placeholder='전화번호'
            className='border p-2 rounded'
            required
          />
          <input
            type='text'
            name='name'
            value={newAccount.name}
            onChange={handleInputChange}
            placeholder='이름'
            className='border p-2 rounded'
            required
          />
        </div>

        {/* ✅ 계정 추가 버튼 */}
        <Button variant='primary' size='md' onClick={handleAddAccount}>
          계정 추가
        </Button>
      </div>

      {/* ✅ 추가된 계정 리스트 */}
      <h3 className='text-lg font-semibold mb-2'>추가된 계정</h3>
      {extraAccounts.length === 0 ? (
        <p className='text-gray-500'>추가된 계정이 없습니다.</p>
      ) : (
        <ul className='bg-white shadow-md rounded-lg p-4 space-y-2'>
          {extraAccounts.map((account, index) => (
            <li key={index} className='flex justify-between items-center border-b py-2'>
              <span>
                {account.name} ({account.email}) - {account.callNumber}
              </span>
              <Button variant='danger' size='sm' onClick={() => handleDeleteAccount(index)}>
                삭제
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ 계정 전송 버튼 */}
      <Button
        variant='primary'
        size='lg'
        className='mt-4 w-full'
        onClick={handleSubmit}
        disabled={extraAccounts.length === 0}
      >
        계정 리스트 전송
      </Button>
    </div>
  )
}

export default Append
