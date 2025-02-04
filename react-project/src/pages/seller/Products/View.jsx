import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const View = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 더미 데이터 정의
  const dummyProduct = {
    name: '사과',
    category: '과일',
    productImage: 'image.jpg',
    company: '철수네과일농장',
    price: 199000,
    stock: 50,
    startdate: "2024-02-24",
    enddate: '2025-02-28',
  };

  // location.state가 없으면 더미 데이터 사용
  const product = location.state || dummyProduct;

  const handleUpdateClick = (pr) => {
    navigate('update', { state: pr });
  };

  const handleDeleteClick = async (pr) => {
    const isConfirmed = window.confirm(`'${pr.name}' 상품 삭제 요청을 보내시겠습니까?`);
    if (isConfirmed) {
      try {
        // 관리자에게 삭제 요청 보내기 (예제 API 호출)
        const response = await fetch('/api/delete-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: pr.name, reason: '사용자 요청' }),
        });

        if (response.ok) {
          alert('삭제 요청이 관리자에게 전송되었습니다.');
          navigate('/seller/products/register'); // 홈이나 목록 페이지로 이동
        } else {
          alert('삭제 요청을 처리하는 데 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('삭제 요청 오류:', error);
        alert('삭제 요청 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className='p-6 bg-white rounded-lg max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-center border-b pb-4'>상품 상세정보</h1>
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <img src={product.productImage} alt={product.name} className='w-full h-64 object-cover rounded-md border' />
        </div>
        <div className='space-y-3'>
          <h2 className='text-xl font-semibold'>{product.name}</h2>
          <p className='text-gray-600'><strong>카테고리:</strong> {product.category}</p>
          <p className='text-gray-600'><strong>회사:</strong> {product.company}</p>
          <p className='text-red-600 text-xl font-bold'>{product.price.toLocaleString()}원</p>
          <p><strong>재고:</strong> {product.stock}개</p>
          <p><strong>판매 기간:</strong> {product.startdate} ~ {product.enddate}</p>
          <div className='flex space-x-4 mt-4'>
            <button
              onClick={() => handleUpdateClick(product)}
              className='bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300'
            >
              수정하기
            </button>
            <button
              onClick={() => handleDeleteClick(product)}
              className='bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 focus:ring focus:ring-red-300'
            >
              삭제 요청 보내기
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default View;
