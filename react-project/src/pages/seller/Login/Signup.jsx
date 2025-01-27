import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/utils/API';

const SellerRegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    representativeName: '',
    businessRegistrationNumber: '',
    contactNumber: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await API.post('/auth/seller/register', formData);
      navigate('/seller/login'); // 회원가입 후 로그인 페이지로 이동
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="p-6 bg-white rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">판매자 회원가입</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {/* 이메일 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* 비밀번호 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="password">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* 비밀번호 확인 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
            비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* 사업체명 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="businessName">
            사업체명
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* 대표자명 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="representativeName">
            대표자명
          </label>
          <input
            type="text"
            id="representativeName"
            name="representativeName"
            value={formData.representativeName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* 사업자 등록번호 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="businessRegistrationNumber">
            사업자 등록번호
          </label>
          <input
            type="text"
            id="businessRegistrationNumber"
            name="businessRegistrationNumber"
            value={formData.businessRegistrationNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* 연락처 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="contactNumber">
            연락처
          </label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SellerRegisterPage;
