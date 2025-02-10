import React, { useState } from 'react'

const CompanyRegister = () => {
  const [companyName, setCompanyName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = () => {
    if (!companyName || !registrationNumber || !contact) {
      setMessage('⚠️ 모든 필드를 입력해주세요.')
      return
    }
    setMessage(`✅ ${companyName}가(이) 성공적으로 등록되었습니다.`)
  }

  return (
    <div className='w-full max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4 text-center'>회사 등록</h1>

      <div className='mb-4'>
        <label className='block text-gray-600 text-sm font-medium mb-1'>회사명</label>
        <input
          type='text'
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder='회사명을 입력하세요'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-gray-600 text-sm font-medium mb-1'>사업자 등록번호</label>
        <input
          type='text'
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          placeholder='사업자 등록번호 입력'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-gray-600 text-sm font-medium mb-1'>연락처</label>
        <input
          type='text'
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder='연락처 입력'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {message && <p className='text-center text-sm font-medium mt-2'>{message}</p>}

      <button
        onClick={handleRegister}
        className='w-full mt-4 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition'
      >
        회사 등록하기
      </button>
    </div>
  )
}

export default CompanyRegister
