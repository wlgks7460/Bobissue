import React, { useState, useEffect } from 'react';
import API from '@/utils/API';
import { useLocation } from 'react-router-dom';

const banks = [
  { code: '004', name: '국민은행', logo: '/images/banks/kb.png' },
  { code: '088', name: '신한은행', logo: '/images/banks/shinhan.png' },
  { code: '020', name: '우리은행', logo: '/images/banks/woori.png' },
  { code: '081', name: '하나은행', logo: '/images/banks/hana.png' },
  { code: '011', name: '농협은행', logo: '/images/banks/nh.png' },
  { code: '023', name: 'SC제일은행', logo: '/images/banks/sc.png' },
  { code: '027', name: '씨티은행', logo: '/images/banks/citi.png' },
  { code: '039', name: '경남은행', logo: '/images/banks/kn.png' },
  { code: '034', name: '광주은행', logo: '/images/banks/gj.png' },
  { code: '031', name: '대구은행', logo: '/images/banks/daegu.png' },
];

const SettleAccount = ({ userInfo, onSave,onClose }) => {
  const [form, setForm] = useState({
    companyName: userInfo?.company?.name || '',
    bankCode: '',
    bankName: '은행 선택',
    accountNumber: '',
    businessLicense: null,
  });
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accountNumber = params.get('accountNumber');
    const bankCode = params.get('bankCode');

    if (accountNumber && bankCode) {
      setForm((prevForm) => ({
        ...prevForm,
        bankCode,
        accountNumber,
        bankName: banks.find((b) => b.code === bankCode)?.name || '선택된 은행',
      }));
      setMessage('✅ 계좌 선택 완료');
    }
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBankSelect = (bank) => {
    setForm({ ...form, bankCode: bank.code, bankName: bank.name });
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bankCode || !form.accountNumber) {
      setMessage('❌ 모든 필수 정보를 입력하세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('bankCode', form.bankCode);
      formData.append('accountNumber', form.accountNumber);

      const response = await API.post('/seller/register-bank', formData);
      if (response.status === 200) {
        setMessage('✅ 계좌 정보가 성공적으로 저장되었습니다.');
        onSave();
      }
    } catch (error) {
      setMessage('❌ 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-6 bg-white rounded-lg border'>
      <h2 className='text-[28px] font-semibold mb-4'>계좌관리</h2>
  
      <div className='mb-4'>
        <label className='block text-sm font-medium'>정산계좌 입력</label>
        <input
          type='text'
          name='accountNumber'
          value={form.accountNumber}
          onChange={handleChange}
          className='mt-1 w-1/2 border-b-2 border-black p-1'
          placeholder='계좌번호 입력'
          required
        />
      </div>
  
      <div className='mb-4'>
        <label className='block text-sm font-medium'>은행 선택</label>
        <div className='w-1/2 grid grid-cols-3 gap-2'>
          {banks.map((bank) => (
            <button
              key={bank.code}
              type='button'
              onClick={() => handleBankSelect(bank)}
              className={`p-2 border rounded-lg flex flex-col items-center ${
                form.bankCode === bank.code ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              <img src={bank.logo} alt={bank.name} className='w-6 h-6 mb-1' />
              <span className='text-xs'>{bank.name}</span>
            </button>
          ))}
        </div>
      </div>
  
     
  
      {message && <p className='text-sm mt-2 text-red-500'>{message}</p>}
  
      <div className="flex gap-2 mt-4">
        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
        >
          저장하기
        </button>
  
        <button
          type="button"
          onClick={onClose}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          취소
        </button>
      </div>
    </form>
  );
  
};

export default SettleAccount;
