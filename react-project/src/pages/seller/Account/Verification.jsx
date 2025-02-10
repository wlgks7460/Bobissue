import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/utils/API";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // 비밀번호 가시성 아이콘

const PasswordVerification = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const redirectPath = "/seller/account/vender/info";
  const debug_mode = true; // 디버그 모드

  // 비밀번호 인증 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (debug_mode) {
      console.log("Debug Mode 활성화: 자동 이동");
      navigate(redirectPath);
      return;
    }

    try {
      const response = await API.post("/check-password", { password });

      if (response.status !== 200) {
        throw new Error(response.data?.message || "비밀번호 인증 실패");
      }

      const { token } = response.data;
      localStorage.setItem("VerificationToken", token);
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || "비밀번호 인증에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🔒 비밀번호 확인
        </h2>

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center animate-fade-in">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "확인 중..." : "인증하기"}
        </button>
      </form>
    </div>
  );
};

export default PasswordVerification;
