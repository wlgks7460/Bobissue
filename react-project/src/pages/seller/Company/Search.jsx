import React, { useState, useEffect } from 'react'
import API from '@/utils/API'
import { FaUserPlus, FaTrashAlt, FaUsers } from 'react-icons/fa'

const Append = () => {
  const debug_mode = localStorage.getItem('debug_mode') === 'true'
  const [extraAccounts, setExtraAccounts] = useState([])
  const [newAccount, setNewAccount] = useState({
    email: '',
    password: '',
    callNumber: '',
    name: '',
  })
  const [companyAccounts, setCompanyAccounts] = useState([])

  useEffect(() => {
    if (debug_mode) {
      setCompanyAccounts([
        { name: '김하늘', email: 'kimhaneul@company.com', callNumber: '010-2345-6789' },
        { name: '박지은', email: 'parkjieun@company.com', callNumber: '010-9876-5432' },
      ])
      return
    }
    const fetchCompanyAccounts = async () => {
      try {
        const response = await API.get(`/sellers/company`)
        setCompanyAccounts(response.data.result.data.sellers || [])
      } catch (error) {
        console.error('회사 계정 불러오기 실패:', error)
      }
    }
    fetchCompanyAccounts()
  }, [extraAccounts, debug_mode])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewAccount({ ...newAccount, [name]: value })
  }

  const handleAddAccount = () => {
    if (!newAccount.email || !newAccount.password || !newAccount.callNumber || !newAccount.name) {
      alert('모든 필드를 입력해주세요.')
      return
    }
    setExtraAccounts([...extraAccounts, newAccount])
    setNewAccount({ email: '', password: '', callNumber: '', name: '' })
  }

  const handleDeleteAccount = (index) => {
    setExtraAccounts(extraAccounts.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    try {
      const response = await API.post('/sellers/extra-accounts', extraAccounts)
      if (response.status === 200) {
        alert('✅ 추가 계정이 성공적으로 등록되었습니다!')
        setExtraAccounts([])
      }
    } catch (error) {
      console.error('❌ 계정 추가 실패:', error)
      alert('❌ 계정 추가 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className='w-full mx-auto px-10 py-12 min-h-screen'>
      <header className='text-center mb-12'>
        <h1 className='text-4xl font-extrabold text-deepCobalt'>추가 계정 관리</h1>
        <p className='text-lg text-steelBlue mt-3'>새로운 계정을 추가하고 관리하세요.</p>
      </header>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12'>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>계정 추가</h3>
          <input
            type='email'
            name='email'
            value={newAccount.email}
            onChange={handleInputChange}
            placeholder='이메일'
            className='p-3 border border-gray-300 rounded-lg w-full mb-4'
          />
          <input
            type='password'
            name='password'
            value={newAccount.password}
            onChange={handleInputChange}
            placeholder='비밀번호'
            className='p-3 border border-gray-300 rounded-lg w-full mb-4'
          />
          <input
            type='text'
            name='callNumber'
            value={newAccount.callNumber}
            onChange={handleInputChange}
            placeholder='전화번호'
            className='p-3 border border-gray-300 rounded-lg w-full mb-4'
          />
          <input
            type='text'
            name='name'
            value={newAccount.name}
            onChange={handleInputChange}
            placeholder='이름'
            className='p-3 border border-gray-300 rounded-lg w-full mb-4'
          />
          <button
            className='w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2'
            onClick={handleAddAccount}
          >
            <FaUserPlus /> 계정 추가
          </button>
        </div>

        <div className='bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>추가된 계정</h3>
          {extraAccounts.length === 0 ? (
            <p className='text-gray-500'>추가된 계정이 없습니다.</p>
          ) : (
            <ul className='space-y-4'>
              {extraAccounts.map((account, index) => (
                <li
                  key={index}
                  className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'
                >
                  <span>
                    {account.name} ({account.email}) - {account.callNumber}
                  </span>
                  <button
                    className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex items-center gap-2'
                    onClick={() => handleDeleteAccount(index)}
                  >
                    <FaTrashAlt /> 삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            className='px-2 py-1 rounded-lg bg-rose-500 text-white'
            onClick={() => handleSubmit()}
          >
            신청하기
          </button>
        </div>
      </div>

      <div className='bg-white shadow-md rounded-lg p-6'>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>같은 회사의 계정</h3>
        {companyAccounts.length === 0 ? (
          <p className='text-gray-500'>같은 회사의 계정이 없습니다.</p>
        ) : (
          <ul className='space-y-4'>
            {companyAccounts.map((account, index) => (
              <li key={index} className='p-4 bg-gray-50 rounded-lg'>
                {account.name} ({account.email}) - {account.callNumber}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Append
