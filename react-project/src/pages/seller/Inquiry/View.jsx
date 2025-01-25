import React, { useEffect, useState } from 'react';
import dummyData from '../Dummy/Inquiries/inquiry'; // 더미 데이터 import
import { useNavigate, useLocation } from 'react-router-dom';

const Inquiry = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [inquiry, setInquiry] = useState(null); // Inquiry 상태
  const navigate = useNavigate();

  useEffect(() => {
    console.log(id);
    // id에 해당하는 데이터를 검색하여 상태 업데이트
    const fetchInquiry = () => {
      const numericId = parseInt(id, 10); // 문자열 id를 숫자로 변환
      const foundInquiry = dummyData.find((item) => item.id === numericId); // ID로 데이터 검색
      setInquiry(foundInquiry);
    };
    fetchInquiry();
  }, [id]); // id가 변경될 때마다 useEffect 실행

  const handleClickReply = () => {
    // 쿼리 스트링을 사용하여 데이터를 전달
    const queryParams = new URLSearchParams({
      id: inquiry.id,
      buyerId: inquiry.buyerId,
      title: inquiry.title,
    }).toString();
    navigate(`/seller/inquiries/reply?${queryParams}`);
  };

  const handleClickDelete = () => {
    if (window.confirm('삭제하시겠겠습니까?')) {
      alert('삭제되었습니다.');
      navigate('/seller/inquiries/list'); // 리스트 페이지로 이동
    } else {
      alert('삭제가 취소되었습니다.');
    }
  };

  const handleClickReport = () => {
    navigate(`/seller/inquiries/report?id=${id}`); // report 페이지로 이동
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {inquiry ? (
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800">Inquiry Details</h1>
          <p className="text-gray-700">
            <strong className="font-medium">Buyer ID:</strong> {inquiry.buyerId}
          </p>
          <p className="text-gray-700">
            <strong className="font-medium">Type:</strong> {inquiry.type}
          </p>
          <p className="text-gray-700">
            <strong className="font-medium">Title:</strong> {inquiry.title}
          </p>
          <p className="text-gray-700">
            <strong className="font-medium">Content:</strong> {inquiry.content}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleClickReply}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              답장
            </button>
            <button
              onClick={handleClickDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              삭제
            </button>
          </div>
          <button
            onClick={handleClickReport}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            신고
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading inquiry...</p>
      )}
    </div>
  );
};

export default Inquiry;
