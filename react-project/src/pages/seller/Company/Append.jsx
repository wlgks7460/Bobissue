import { useEffect, useState } from 'react'
import API from '@/utils/API' // ✅ API 유틸리티 임포트

const Append = () => {
  const debug_mode = localStorage.getItem('debug_mode') === 'true' // ✅ 디버그 모드 확인
  const [extraAccounts, setExtraAccounts] = useState([]) // ✅ 추가 계정 리스트
  const [newAccount, setNewAccount] = useState({
    email: '',
    password: '',
    callNumber: '',
    name: '',
  })
  const [companyAccounts, setCompanyAccounts] = useState([]) // ✅ 같은 회사의 계정 리스트

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

  // ✅ 회사 계정 목록 가져오기 (디버그 모드)
  useEffect(() => {
    if (debug_mode) {
      setCompanyAccounts([
        // 더미 데이터
        {
          name: '김하늘',
          email: 'kimhaneul@company.com',
          callNumber: '010-2345-6789',
        },
        {
          name: '박지은',
          email: 'parkjieun@company.com',
          callNumber: '010-9876-5432',
        },
      ])
      return
    }

    // API에서 현재 회사의 계정 리스트 가져오기
    if (extraAccounts.length > 0) {
      const companyEmail = extraAccounts[0].email.split('@')[1] // 회사 이메일 도메인으로 필터링
      const fetchCompanyAccounts = async () => {
        try {
          const response = await API.get(`/sellers/company-accounts?emailDomain=${companyEmail}`)
          setCompanyAccounts(response.data.result.data || [])
        } catch (error) {
          console.error('회사 계정 불러오기 실패:', error)
        }
      }

      fetchCompanyAccounts()
    }
  }, [extraAccounts, debug_mode])

  return (
    <div className='p-6 max-w-6xl mx-auto flex'>
      {/* 좌측: 추가 계정 관리 */}
      <div className='w-1/2 pr-6'>
        <h2 className='text-2xl font-semibold mb-6 text-center text-gray-800'>추가 계정 관리</h2>

        {/* ✅ 입력 폼 */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <input
              type='email'
              name='email'
              value={newAccount.email}
              onChange={handleInputChange}
              placeholder='이메일'
              className='p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
            <input
              type='password'
              name='password'
              value={newAccount.password}
              onChange={handleInputChange}
              placeholder='비밀번호'
              className='p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
            <input
              type='text'
              name='callNumber'
              value={newAccount.callNumber}
              onChange={handleInputChange}
              placeholder='전화번호'
              className='p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
            <input
              type='text'
              name='name'
              value={newAccount.name}
              onChange={handleInputChange}
              placeholder='이름'
              className='p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* ✅ 계정 추가 버튼 */}
          <button
            className='w-full bg-blue-500 text-white px-4 py-2 mt-6 rounded-md hover:bg-blue-600 transition-all'
            onClick={handleAddAccount}
          >
            계정 추가
          </button>
        </div>

        {/* ✅ 추가된 계정 리스트 */}
        <h3 className='text-lg font-semibold mb-2 mt-6 text-gray-800'>추가된 계정</h3>
        {extraAccounts.length === 0 ? (
          <p className='text-gray-500'>추가된 계정이 없습니다.</p>
        ) : (
          <ul className='bg-white shadow-md rounded-lg p-4 space-y-4'>
            {extraAccounts.map((account, index) => (
              <li key={index} className='flex justify-between items-center border-b py-2'>
                <span className='text-gray-700'>
                  {account.name} ({account.email}) - {account.callNumber}
                </span>
                <button
                  className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition'
                  onClick={() => handleDeleteAccount(index)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* ✅ 계정 전송 버튼 */}
        <button
          className='w-full bg-green-500 text-white px-6 py-3 mt-6 rounded-md disabled:bg-gray-300 hover:bg-green-600 transition-all'
          onClick={handleSubmit}
          disabled={extraAccounts.length === 0}
        >
          계정 리스트 전송
        </button>
      </div>

      {/* 우측: 같은 회사의 계정 리스트 */}
      <div className='w-1/2 pl-6'>
        <h3 className='text-lg font-semibold mb-4 text-gray-800'>같은 회사의 계정들</h3>
        {companyAccounts.length === 0 ? (
          <p className='text-gray-500'>같은 회사의 계정이 없습니다.</p>
        ) : (
          <ul className='bg-white shadow-md rounded-lg p-4 space-y-4'>
            {companyAccounts.map((account, index) => (
              <li key={index} className='flex justify-between items-center border-b py-2'>
                <span className='text-gray-700'>
                  {account.name} ({account.email}) - {account.callNumber}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Append
