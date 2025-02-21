import React, { useState, useEffect } from 'react'
import API from '@/utils/API'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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

const CompanyRegister = () => {
 const token = localStorage.getItem('access_token')
  const navigate = useNavigate()

  // ✅ 페이지 로드 시 로그인 확인
  useEffect(() => {
    if (!token) {
      navigate('/seller/login')
    }
  }, [navigate]) // ✅ 의존성 배열 추가

  const [form, setForm] = useState({
    companyName: '',
    companyLicense: '',
    bankName: '은행 선택',
    bankAccount: '',
  })

  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  // ✅ 회사 등록 여부 확인 함수

  const fetchUserStatus = async () => {
    try {
      const response = await API.get('/sellers/profile')
      console.log(response.data.result.data)
      if(response.data.result.data.company===null){
        console.error('회사 정보 불러오기 실패:',error)
      }else{
        navigate('/seller')
      }
    
    } catch (err) {
      console.error(err)
    }
  }
   useEffect(() => {
      if (!token){
        navigate('/seller/login')
        return
      } 
      //console.log('hello');
      fetchUserStatus()
    }, [token])


  // ✅ 페이지 로드 시 회사 정보 확인


  // 📌 입력 필드 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'bankAccount' ? value.replace(/\D/g, '') : value }) // 숫자만 입력 가능
  }

  // 📌 은행 선택 핸들러
  const handleBankSelect = (bank) => {
    setForm({ ...form, bankName: bank.name })
  }

  // 📌 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.companyName ||
      !form.companyLicense ||
      form.bankName === '은행 선택' ||
      !form.bankAccount
    ) {
      setMessage({ text: '❌ 모든 필수 정보를 입력하세요.', type: 'error' })
      return
    }

    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const response = await API.post('/sellers/company', {
        name: form.companyName,
        license: form.companyLicense,
        bank: form.bankName,
        bankAccount: form.bankAccount,
      })

      if (response.status === 200) {
        setMessage({ text: '✅ 회사 정보가 성공적으로 등록되었습니다.', type: 'success' })
        setForm({ companyName: '', companyLicense: '', bankName: '은행 선택', bankAccount: '' })

        // ✅ 등록 후 회사 정보 다시 불러오기
        fetchUserStatus()
      }
    } catch (error) {
      setMessage({ text: '❌ 등록 중 오류가 발생했습니다.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 p-6'>
      <form onSubmit={handleSubmit} className='w-full max-w-lg bg-white p-6 rounded-xl shadow-lg'>
        <h2 className='text-2xl font-semibold mb-4 text-center'>🏢 회사 등록</h2>

        {/* ✅ 회사명 입력 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>회사명</label>
          <input
            type='text'
            name='companyName'
            value={form.companyName}
            onChange={handleChange}
            className='mt-1 w-full border-b-2 border-gray-400 p-2 text-lg focus:border-blue-500 outline-none'
            placeholder='회사명을 입력하세요'
            required
          />
        </div>

        {/* ✅ 사업자등록번호 입력 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>사업자등록번호</label>
          <input
            type='text'
            name='companyLicense'
            value={form.companyLicense}
            onChange={handleChange}
            className='mt-1 w-full border-b-2 border-gray-400 p-2 text-lg focus:border-blue-500 outline-none'
            placeholder='사업자등록번호 입력'
            required
          />
        </div>

        {/* ✅ 계좌번호 입력 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>정산계좌</label>
          <input
            type='text'
            name='bankAccount'
            value={form.bankAccount}
            onChange={handleChange}
            className='mt-1 w-full border-b-2 border-gray-400 p-2 text-lg focus:border-blue-500 outline-none'
            placeholder='계좌번호 입력 (숫자만)'
            required
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
                onClick={() => handleBankSelect(bank)}
                className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                  form.bankName === bank.name
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

        {/* ✅ 버튼 */}
        <button
          type='submit'
          className='w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all'
          disabled={loading}
        >
          {loading ? '저장 중...' : '등록하기'}
        </button>
      </form>
    </div>
  )
}

export default CompanyRegister
