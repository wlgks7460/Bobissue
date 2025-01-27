import React, { useEffect, useState } from 'react';

const Info = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('SELLER_AUTH_TOKEN');
        if (!token) {
          throw new Error('인증 토큰이 없습니다.');
        }

        // 디버깅용 가상 응답
        const response = {
          ok: true,
          json: async () => ({
            id: '12345',
            name: '홍길동',
            email: 'hong@example.com',
            createdAt: '2022-01-01T12:00:00Z',
          }),
        };

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          throw new Error('사용자 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserInfo();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!userInfo) {
    return <p className="text-gray-600">로딩 중...</p>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">사용자 정보</h2>
      <div className="mb-2">
        <label className="block font-medium text-gray-700">아이디:</label>
        <span className="text-gray-900">{userInfo.id}</span>
      </div>
      <div className="mb-2">
        <label className="block font-medium text-gray-700">이름:</label>
        <span className="text-gray-900">{userInfo.name}</span>
      </div>
      <div className="mb-2">
        <label className="block font-medium text-gray-700">이메일:</label>
        <span className="text-gray-900">{userInfo.email}</span>
      </div>
      <div className="mb-2">
        <label className="block font-medium text-gray-700">가입일:</label>
        <span className="text-gray-900">{new Date(userInfo.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default Info;
