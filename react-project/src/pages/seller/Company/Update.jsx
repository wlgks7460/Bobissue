import React, { useEffect, useState } from 'react'
import API from '@/utils/API'
import { useNavigate } from 'react-router-dom'

// ✅ 은행 리스트
const banks = [
  { name: '국민은행', logo: '/images/banks/kb.png' },
  { name: '신한은행', logo: '/images/banks/shinhan.png' },
  { name: '우리은행', logo: '/images/banks/woori.png' },
  { name: '하나은행', logo: '/images/banks/hana.png' },
  { name: '농협은행', logo: '/images/banks/nh.png' },
  { name: 'SC제일은행', logo: '/images/banks/sc.png' },
  { name: '씨티은행', logo: '/images/banks/citi.png' },
  { name: '경남은행', logo: '/images/banks/kn.png' },
  { name: '광주은행', logo: '/images/banks/gj.png' },
  { name: '대구은행', logo: '/images/banks/daegu.png' },
]

const CompanyUpdate = () => {
  const navigate = useNavigate()

  // ✅ 회사 정보 상태 관리
  const [company, setCompany] = useState({
    companyNo: '',
    name: '',
    license: '',
    bank: '',
    bankAccount: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // ✅ 회사 정보 불러오기
  async function fetchCompanyData() {
    try {
      const response = await API.get('/sellers/company')
      const data = response.data?.result?.data
      console.log(data)
      if (!data || !data.companyNo) {
        throw new Error('회사 정보를 찾을 수 없습니다.')
      }

      setCompany({
        companyNo: data.companyNo,
        name: data.name || '',
        license: data.license || '',
        bank: data.bank || '',
        bankAccount: data.bankAccount || '',
      })
    } catch (error) {
      console.error('회사 정보 불러오기 실패:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ 페이지 로드 시 회사 정보 불러오기
  useEffect(() => {
    fetchCompanyData()
  }, [])

  // 📌 입력 필드 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setCompany({ ...company, [name]: value })
  }

  // 📌 은행 선택 핸들러
  const handleBankSelect = (selectedBank) => {
    setCompany({ ...company, bank: selectedBank })
  }

  // 📌 폼 제출 핸들러 (회사 정보 업데이트)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    console.log(company)

    try {
      const response = await API.post(`/sellers/company/${company.companyNo}`, {
        name: company.name,
        bank: company.bank,
        bankAccount: company.bankAccount,
      })

      if (response.status === 200) {
        setMessage('✅ 회사 정보가 성공적으로 업데이트되었습니다.')
      }
    } catch (error) {
      setMessage('❌ 업데이트 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>회사 정보를 불러오는 중...</p>
  if (error) return <p className='text-red-500'>{error}</p>

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-4'>🏢 회사 정보 수정</h2>
      <form onSubmit={handleSubmit} className='bg-white shadow-md rounded-lg p-4'>
        {/* ✅ 회사명 입력 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>회사명</label>
          <input
            type='text'
            name='name'
            value={company.name}
            onChange={handleChange}
            className='mt-1 w-full border-b-2 border-gray-400 p-2 text-lg focus:border-blue-500 outline-none'
            placeholder='회사명을 입력하세요'
            required
          />
        </div>

        {/* ✅ 사업자등록번호 (readonly) */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>사업자등록번호</label>
          <input
            type='text'
            name='license'
            value={company.license}
            className='mt-1 w-full border-b-2 border-gray-400 p-2 text-lg bg-gray-200 cursor-not-allowed'
            readOnly
          />
        </div>

        {/* ✅ 은행 선택 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>은행 선택</label>
          <div className='grid grid-cols-3 gap-2 mt-2'>
            {banks.map((bank) => (
              <button
                key={bank.name}
                type='button'
                onClick={() => handleBankSelect(bank.name)}
                className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                  company.bank === bank.name
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <img src={bank.logo} alt={bank.name} className='w-8 h-8 mb-1' />
                <span className='text-xs'>{bank.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ 계좌번호 입력 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>계좌번호</label>
          <input
            type='text'
            name='bankAccount'
            value={company.bankAccount}
            onChange={handleChange}
            className='mt-1 w-full border-b-2 border-gray-400 p-2 text-lg focus:border-blue-500 outline-none'
            placeholder='계좌번호 입력'
            required
          />
        </div>

        {/* ✅ 메시지 표시 */}
        {message && <p className='mt-4 text-sm text-green-600'>{message}</p>}

        {/* ✅ 업데이트 버튼 */}
        <button
          type='submit'
          className='w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all'
          disabled={loading}
        >
          {loading ? '업데이트 중...' : '정보 수정하기'}
        </button>
      </form>
    </div>
  )
}

export default CompanyUpdate
