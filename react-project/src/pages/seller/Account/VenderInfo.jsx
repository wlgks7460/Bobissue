import React, { useState, useEffect } from "react";
import API from "@/utils/API";
import Info from "./Form/Info";
import UpdateInfo from "./Form/Update_Info";
import Withdrawal from "./Form/Withdrawal";
import SettleAccount from "./Form/SettleAccount"; // 추가된 컴포넌트
import { Loader2 } from "lucide-react"; // 로딩 아이콘

const VenderInfo = () => {
  const debug_mode = false; // 디버그 모드 설정 (true이면 더미 데이터를 사용)

  // ✅ 디버그 모드에서 사용할 더미 데이터
  const dummyData = {
    sellerNo: "12345",
    name: "홍길동",
    email: "hong@example.com",
    company: {
      name: "홍길동 회사",
      license: "123-45-67890",
      status: "Y",
    },
    callNumber: "010-1234-5678",
    bankAccount: "국민은행 123-456-7890",
  };

  // ✅ 상태 관리
  const [userInfo, setUserInfo] = useState(debug_mode ? dummyData : null);
  const [loading, setLoading] = useState(!debug_mode);
  const [error, setError] = useState("");
  const [isUpdatePage, setIsUpdatePage] = useState(false);
  const [isSettleAccountPage, setIsSettleAccountPage] = useState(false);

  // ✅ 사용자 정보를 가져오는 useEffect
  useEffect(() => {
    if (debug_mode) {
      setUserInfo(dummyData);
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("인증 토큰이 없습니다.");

        const response = await API.get("/sellers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUserInfo(response.data?.result || dummyData);
        } else {
          throw new Error("서버 오류가 발생했습니다.");
        }
      } catch (err) {
        setError(err.message);
        setUserInfo(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [isUpdatePage, isSettleAccountPage]);

  // ✅ 로딩 화면
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-6">
      <div className="w-full max-w-2xl bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-lg">
        {/* ✅ 페이지 상태에 따라 컴포넌트 렌더링 */}
        {isUpdatePage ? (
          <UpdateInfo
            userInfo={userInfo}
            onSave={(updatedInfo) => {
              setUserInfo(updatedInfo);
              setIsUpdatePage(false);
            }}
            onClose={() => setIsUpdatePage(false)}
          />
        ) : isSettleAccountPage ? (
          <SettleAccount
            userInfo={userInfo}
            onSave={(formData) => {
              setUserInfo((prev) => ({ ...prev, ...formData }));
              setIsSettleAccountPage(false);
            }}
            onClose={() => setIsSettleAccountPage(false)}
          />
        ) : (
          <Info userInfo={userInfo} />
        )}

        {/* ✅ 버튼 그룹 */}
        <div className="mt-6 flex justify-center space-x-4">
          {!isUpdatePage && !isSettleAccountPage && (
            <>
              {/* 개인정보 수정 버튼 */}
              <button
                onClick={() => setIsUpdatePage(true)}
                className="px-5 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-all"
              >
                개인정보 수정
              </button>

              {/* 사업자 정보 수정 버튼 */}
              <button
                onClick={() => setIsSettleAccountPage(true)}
                className="px-5 py-2 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition-all"
              >
                사업자 정보 수정
              </button>
            </>
          )}
        </div>

        {/* ✅ 오류 메시지 */}
        {error && (
          <p className="mt-4 text-center text-red-500 animate-fade-in">
            {error}
          </p>
        )}

        {/* ✅ 판매자 탈퇴 컴포넌트 */}
        <div className="mt-8">
          <Withdrawal userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default VenderInfo;
