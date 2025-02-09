import React, { useState, useEffect } from 'react';
import API from '@/utils/API';
import Info from './Form/Info';
import UpdateInfo from './Form/Update_Info';
import Withdrawal from './Form/Withdrawal';
import SettleAccount from './Form/SettleAccount'; // 추가된 컴포넌트

const VenderInfo = () => {
  const debug_mode = true; // 디버그 모드 설정 (true이면 더미 데이터를 사용)
  
  // ✅ 디버그 모드에서 사용할 더미 데이터
  const dummyData = {
    sellerNo: '12345',
    name: '홍길동',
    email: 'hong@example.com',
    company: {
      name: '홍길동 회사',
      license: '123-45-67890',
      status: 'Y',
    },
    callNumber: '010-1234-5678',
    bankAccount: '국민은행 123-456-7890',
  };

  // ✅ 상태 관리
  const [userInfo, setUserInfo] = useState(debug_mode ? dummyData : null); // 사용자 정보
  const [loading, setLoading] = useState(!debug_mode); // 로딩 상태 (디버그 모드면 false)
  const [error, setError] = useState(''); // 에러 메시지
  const [isUpdatePage, setIsUpdatePage] = useState(false); // 개인정보 수정 페이지 여부
  const [isSettleAccountPage, setIsSettleAccountPage] = useState(false); // 사업자 정보 수정 페이지 여부
  const [hasBusinessRegistration, setHasBusinessRegistration] = useState(false); // 사업자 등록 여부
  
  // ✅ 사용자 정보를 가져오는 useEffect
  useEffect(() => {
    if (debug_mode) {
      setUserInfo(dummyData);
      setLoading(false); // 디버그 모드에서는 바로 로딩 종료
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('인증 토큰이 없습니다.');

        const response = await API.get('/sellers/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const data = response.data;
          setUserInfo(data.status === 'OK' && data.result ? data.result : dummyData);
        } else {
          throw new Error('서버 오류가 발생했습니다.');
        }
      } catch (err) {
        setError(err.message);
        setUserInfo(dummyData); // 에러 발생 시 기본 데이터 사용
      } finally {
        setLoading(false); // 데이터 로딩 완료 후 로딩 상태 해제
      }
    };

    fetchUserInfo();
  }, [isUpdatePage, isSettleAccountPage]); // 개인정보/사업자 정보 페이지가 변경될 때마다 실행

  // ✅ 로딩 중일 경우 출력
  if (loading) return <p>로딩 중...</p>;

  // ✅ 개인정보 수정 요청 함수
  const handleSave = async (updatedInfo) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('인증 토큰이 없습니다.');

      const response = await API.put(`/sellers/${updatedInfo.sellerNo}`, updatedInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUserInfo(response.data.result); // 수정된 정보 반영
        setIsUpdatePage(false); // 수정 후 원래 페이지로 이동
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ 사업자 정보 수정 요청 함수
  const handleAccountSave = async (formData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('인증 토큰이 없습니다.');

      const response = await API.post(`/sellers/business-info`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUserInfo((prev) => ({ ...prev, ...response.data.result })); // 업데이트된 사업자 정보 반영
        setIsSettleAccountPage(false); // 수정 후 원래 페이지로 이동
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {/* ✅ 개인정보 수정 페이지 */}
      {isUpdatePage ? (
        <UpdateInfo userInfo={userInfo} onSave={handleSave} onClose={() => setIsUpdatePage(false)} />
      ) : isSettleAccountPage ? (
        /* ✅ 사업자 정보 수정 페이지 */
        <SettleAccount userInfo={userInfo} onSave={handleAccountSave} onClose={() => setIsSettleAccountPage(false)} />
      ) : (
        /* ✅ 기본 판매자 정보 페이지 */
        <Info userInfo={userInfo} />
      )}

      {/* ✅ 수정 버튼 (개인정보 수정 / 사업자 정보 수정) */}
      <div className='mt-4 flex space-x-4'>
        {!isUpdatePage && !isSettleAccountPage && (
          <>
            {/* 개인정보 수정 버튼 */}
            <button
              onClick={() => setIsUpdatePage(true)}
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
            >
              개인정보 수정
            </button>

            {/* 사업자 정보 수정 버튼 */}
            <button
              onClick={() => setIsSettleAccountPage(true)}
              className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
            >
              사업자 정보 수정
            </button>
          </>
        )}
      </div>

      {/* ✅ 판매자 탈퇴 컴포넌트 */}
      <div className='mt-6'>
        <Withdrawal userInfo={userInfo} />
      </div>
    </div>
  );
};

export default VenderInfo;
