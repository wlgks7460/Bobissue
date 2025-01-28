import React, { useState, useEffect } from 'react';
import OrderPopup from './Popup/OrderPopup';
import API from '../../../utils/API';

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  

  // 주문 선택 처리
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  // 팝업 열기
  const handleOpenPopup = (order) => {
    setPopupData(order);
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  // 운송사 변경 처리
  const handleCourierChange = (orderId, value) => {
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [orderId]: {
        ...prevDetails[orderId],
        courier: value,
      },
    }));
  };

  // 송장번호 변경 처리
  const handleTrackingNumberChange = (orderId, value) => {
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [orderId]: {
        ...prevDetails[orderId],
        trackingNumber: value,
      },
    }));
  };

  // 주문 처리 제출
  const handleSubmitOrder = (orderId) => {
    const { courier, trackingNumber } = orderDetails[orderId] || {};

    if (!courier || !trackingNumber) {
      alert('운송사와 송장 번호를 모두 입력해주세요.');
      return;
    }

    console.log(`주문 ${orderId} 처리 중...`);
    console.log(`운송사: ${courier}, 송장번호: ${trackingNumber}`);

    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [orderId]: {
        ...prevDetails[orderId],
        submitted: true,
      },
    }));
  };

  const dummyList = [
    {
      orderId: '12345',
      productName: '무선충전기',
      option: '블랙',
      quantity: 1,
      status: '결제완료',
    },
    {
      orderId: '12346',
      productName: '유선충전기',
      option: '화이트',
      quantity: 2,
      status: '배송중',
    },
  ];

  // 주문 목록 가져오기
  useEffect(() => {
    const fetchOrders = async () => {
      if (!seller_id) {
        setError('판매자 ID가 없습니다.');
        return;
      }

      try {
        setIsLoading(true)       
        //const response = await API.get(`api/${seller_id}/order`);   
        const response =await API.get('api/order')
        setOrderList(response.data); // 주문 목록 설정
      } catch (error) {
        console.error('주문 목록을 가져오는 중 에러 발생:', error);
        setError('주문 목록을 가져오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, );
 //[seller_id]
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">주문 관리</h1>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-gray-200 text-left bg-white">
          <thead>
            <tr>
              <th className="p-3 border-b">선택</th>
              <th className="p-3 border-b">주문 번호</th>
              <th className="p-3 border-b">상품명</th>
              <th className="p-3 border-b">옵션/수량</th>
              <th className="p-3 border-b">주문 상태</th>
              <th className="p-3 border-b">송장 입력</th>
            </tr>
          </thead>
          <tbody>
            {dummyList.map((order) => {
              const details = orderDetails[order.orderId] || {};
              return (
                <tr key={order.orderId} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.orderId)}
                      onChange={() => handleSelectOrder(order.orderId)}
                      disabled={order.status !== '결제완료'}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="p-3">{order.orderId}</td>
                  <td className="p-3">
                    {order.status === '결제완료' ? (
                      <button
                        onClick={() => handleOpenPopup(order)}
                        className="text-blue-500 underline"
                      >
                        {order.productName}
                      </button>
                    ) : (
                      order.productName
                    )}
                  </td>
                  <td className="p-3">
                    {order.option} / {order.quantity}
                  </td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">
                    {order.status === '결제완료' && !details.submitted ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={details.courier || ''}
                          onChange={(e) => handleCourierChange(order.orderId, e.target.value)}
                          className="border rounded p-1"
                        >
                          <option value="">택배사 선택</option>
                          <option value="CJ대한통운">CJ대한통운</option>
                          <option value="한진택배">한진택배</option>
                          <option value="로젠택배">로젠택배</option>
                        </select>
                        <input
                          type="text"
                          placeholder="송장 번호 입력"
                          value={details.trackingNumber || ''}
                          onChange={(e) =>
                            handleTrackingNumberChange(order.orderId, e.target.value)
                          }
                          className="border rounded p-1"
                        />
                        <button
                          onClick={() => handleSubmitOrder(order.orderId)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          발주하기
                        </button>
                      </div>
                    ) : details.submitted ? (
                      <div>
                        <p>운송사: {details.courier}</p>
                        <p>송장번호: {details.trackingNumber}</p>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {popupData && <OrderPopup order={popupData} onClose={handleClosePopup} />}
    </div>
  );
};

export default Orders;
