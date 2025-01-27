import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '@/utils/API';

const SellerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const SELLER_AUTH_TOKEN = localStorage.getItem('SELLER_AUTH_TOKEN');
    if (SELLER_AUTH_TOKEN) {
      const queryParams = new URLSearchParams(location.search);
      const redirectPath = queryParams.get('path') || '/seller'; // 기본값은 '/seller'
      navigate(redirectPath, { replace: true }); // 토큰이 있으면 리디렉션
    }
  }, [navigate, location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/seller/login', { email, password });
      localStorage.setItem('SELLER_AUTH_TOKEN', response.data.token); // JWT 토큰 저장

      // 리디렉션 경로 추출
      const queryParams = new URLSearchParams(location.search);
      const redirectPath = queryParams.get('path') || '/seller'; // 기본값은 '/seller'
      navigate(redirectPath); // 로그인 성공 시 리디렉션
    } catch (err) {
      setError('이메일 또는 비밀번호를 확인하세요.');
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `/auth/seller/social/${provider}`; // 소셜 로그인 URL로 리디렉션
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">판매자 로그인</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              placeholder="example@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            로그인
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-600 mb-2">소셜 계정으로 로그인</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Google
            </button>
            <button
              onClick={() => handleSocialLogin('kakao')}
              className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500"
            >
              Kakao
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <a href="/password/reset" className="text-blue-500 hover:underline">
              비밀번호를 잊으셨나요?
            </a>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            회원이 아니세요?{' '}
            <a
              href="/seller/signup"
              className="text-blue-500 font-medium hover:underline"
            >
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLoginPage;
