import React, { useState, useEffect } from "react";
import API from "@/utils/API";
import { useLocation } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react"; // 아이콘 추가

const banks = [
  { code: "004", name: "국민은행", logo: "/images/banks/kb.png" },
  { code: "088", name: "신한은행", logo: "/images/banks/shinhan.png" },
  { code: "020", name: "우리은행", logo: "/images/banks/woori.png" },
  { code: "081", name: "하나은행", logo: "/images/banks/hana.png" },
  { code: "011", name: "농협은행", logo: "/images/banks/nh.png" },
  { code: "023", name: "SC제일은행", logo: "/images/banks/sc.png" },
  { code: "027", name: "씨티은행", logo: "/images/banks/citi.png" },
  { code: "039", name: "경남은행", logo: "/images/banks/kn.png" },
  { code: "034", name: "광주은행", logo: "/images/banks/gj.png" },
  { code: "031", name: "대구은행", logo: "/images/banks/daegu.png" },
];

const SettleAccount = ({ userInfo, onSave, onClose }) => {
  const [form, setForm] = useState({
    companyName: userInfo?.company?.name || "",
    bankCode: "",
    bankName: "은행 선택",
    accountNumber: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accountNumber = params.get("accountNumber");
    const bankCode = params.get("bankCode");

    if (accountNumber && bankCode) {
      setForm((prev) => ({
        ...prev,
        bankCode,
        accountNumber,
        bankName: banks.find((b) => b.code === bankCode)?.name || "선택된 은행",
      }));
      setMessage({ text: "✅ 계좌 선택 완료", type: "success" });
    }
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.name === "accountNumber") {
      const value = e.target.value.replace(/\D/g, ""); // 숫자만 입력
      setForm({ ...form, accountNumber: value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleBankSelect = (bank) => {
    setForm({ ...form, bankCode: bank.code, bankName: bank.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bankCode || !form.accountNumber) {
      setMessage({ text: "❌ 모든 필수 정보를 입력하세요.", type: "error" });
      return;
    }

    try {
      const response = await API.post("/seller/register-bank", {
        bankCode: form.bankCode,
        accountNumber: form.accountNumber,
      });

      if (response.status === 200) {
        setMessage({ text: "✅ 계좌 정보가 성공적으로 저장되었습니다.", type: "success" });
        onSave();
      }
    } catch (error) {
      setMessage({ text: "❌ 저장 중 오류가 발생했습니다.", type: "error" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white bg-opacity-95 backdrop-blur-md p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">💰 계좌 관리</h2>

        {/* ✅ 계좌번호 입력 필드 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">정산계좌 입력</label>
          <input
            type="text"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            className="mt-1 w-full border-b-2 border-gray-400 p-2 text-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none transition-all"
            placeholder="계좌번호 입력 (숫자만)"
            required
          />
        </div>

        {/* ✅ 은행 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">은행 선택</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {banks.map((bank) => (
              <button
                key={bank.code}
                type="button"
                onClick={() => handleBankSelect(bank)}
                className={`p-3 border rounded-lg flex flex-col items-center transition-all duration-200 ${
                  form.bankCode === bank.code
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <img src={bank.logo} alt={bank.name} className="w-8 h-8 mb-1" />
                <span className="text-xs">{bank.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ 메시지 표시 (성공 또는 오류) */}
        {message.text && (
          <div
            className={`mt-4 flex items-center gap-2 text-sm p-2 rounded-lg ${
              message.type === "success" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
            }`}
          >
            {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* ✅ 버튼 그룹 */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="w-1/2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            저장하기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettleAccount;
