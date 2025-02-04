import React, { useState } from 'react';

const InquiryFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [productState, setProductState] = useState('');

  // 기간 설정 버튼 핸들러
  const handleDateRangeClick = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    setCustomStartDate(pastDate.toISOString().split('T')[0]);
    setCustomEndDate(today.toISOString().split('T')[0]);
    setSelectedDateRange(days);
  };

  // 검색 버튼 클릭 시 부모 컴포넌트로 검색 조건 전달
  const handleInquirySubmit = () => {
    const filters = {
      search: searchTerm,
      companyName: companyName,
      status: productState,
      startDate: customStartDate,
      endDate: customEndDate,
    };

    onSearch(filters);  // ✅ 부모 컴포넌트에서 API 요청 실행
  };

  return (
    <div>
      {/* 검색어 입력 (등록상품명 / 회사명) */}
      <div className="flex space-x-6">
        {/* 등록상품명 입력 */}
        <div>
          <label className="block text-[16px] font-bold mb-2">등록상품명</label>
          <input
            className="w-[400px] p-3 border rounded-md"
            type="text"
            placeholder="등록상품명을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 회사명 입력 */}
        <div>
          <label className="block text-[16px] font-bold mb-2">회사명</label>
          <input
            className="w-[400px] p-3 border rounded-md"
            type="text"
            placeholder="회사명을 입력하세요"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      </div>

      {/* 판매 상태 선택 */}
      <div className="mt-6">
        <label className="block text-[16px] font-bold mb-2">판매 상태</label>
        <select
          className="w-[400px] p-3 border rounded-md"
          value={productState}
          onChange={(e) => setProductState(e.target.value)}
        >
          <option value="">판매 상태 선택</option>
          <option value="판매중">판매중</option>
          <option value="판매완료">판매완료</option>
        </select>
      </div>

      {/* 기간 선택 버튼 */}
      <div className="mt-6">
        <label className="block text-[16px] font-bold mb-2">기간 선택</label>
        <div className="space-x-2">
          <button className="px-4 py-2 rounded-md bg-gray-200" onClick={() => handleDateRangeClick(0)}>오늘</button>
          <button className="px-4 py-2 rounded-md bg-gray-200" onClick={() => handleDateRangeClick(7)}>7일</button>
          <button className="px-4 py-2 rounded-md bg-gray-200" onClick={() => handleDateRangeClick(30)}>30일</button>
          <button className="px-4 py-2 rounded-md bg-gray-200" onClick={() => handleDateRangeClick(180)}>180일</button>
          <button className="px-4 py-2 rounded-md bg-gray-200" onClick={() => handleDateRangeClick(365)}>1년</button>
        </div>
      </div>

      {/* 특정기간 설정 */}
      <div className="mt-4 flex space-x-4">
        <div>
          <label className="block text-[16px] font-bold mb-2">시작 날짜</label>
          <input
            className="w-[200px] p-2 border rounded-md"
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[16px] font-bold mb-2">종료 날짜</label>
          <input
            className="w-[200px] p-2 border rounded-md"
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* 검색 버튼 */}
      <button className="mt-5 p-3 bg-blue-500 text-white rounded-md" onClick={handleInquirySubmit}>
        검색하기
      </button>
    </div>
  );
};

export default InquiryFilter;
