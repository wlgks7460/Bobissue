import React from 'react'
import './OrderPopup.css' // 스타일 파일 추가

const OrderPopup = ({ order, onClose }) => {
  //order 정보 받아옴옴
  const productDetails = {
    orderId: 1001,
    productId: 501,
    productName: order.productName,
    category: '전자기기',
    price: 120000,
    stock: 50,
    isSoldOut: false,
    orderQuantity: 2,
    shipFromName: '서울 물류 센터',
    shipFromAddress: '서울특별시 강남구 테헤란로 123',
    shipFromContact: '02-123-4567',
    returnToName: '서울 반품 센터',
  }

  return (
    <div className='popup-overlay'>
      <div className='popup-container'>
        <button className='popup-close' onClick={onClose}>
          닫기
        </button>
        <h2>상품 상세 정보</h2>

        {/* 상품 정보 */}
        <div className='popup-section'>
          <h3>상품 정보</h3>
          <div className='popup-info'>
            <label>상품 ID</label>
            <p>{productDetails.productId}</p>
          </div>
          <div className='popup-info'>
            <label>상품명</label>
            <p>{productDetails.productName}</p>
          </div>
          <div className='popup-info'>
            <label>카테고리</label>
            <p>{productDetails.category}</p>
          </div>
          <div className='popup-info'>
            <label>판매가</label>
            <p>{productDetails.price.toLocaleString()}원</p>
          </div>
          <div className='popup-info'>
            <label>판매 가능 수량</label>
            <p>{productDetails.stock}</p>
          </div>
          <div className='popup-info'>
            <label>품절 여부</label>
            <p>{productDetails.isSoldOut ? '품절' : '판매 중'}</p>
          </div>
          <div className='popup-info'>
            <label>판매 수량</label>
            <p>{order.quantity}</p>
          </div>
        </div>

        {/* 배송 정보 */}
        <div className='popup-section'>
          <h3>배송 정보</h3>
          <div className='popup-info'>
            <label>출고지명</label>
            <p>{productDetails.shipFromName}</p>
          </div>
          <div className='popup-info'>
            <label>출고지 주소</label>
            <p>{productDetails.shipFromAddress}</p>
          </div>
          <div className='popup-info'>
            <label>출고지 연락처</label>
            <p>{productDetails.shipFromContact}</p>
          </div>
          <div className='popup-info'>
            <label>반품지명</label>
            <p>{productDetails.returnToName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPopup
