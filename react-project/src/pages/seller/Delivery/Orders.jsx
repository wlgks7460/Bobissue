import React, { useState } from 'react'
import OrderPopup from './Popup/OrderPopup'

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [popupData, setPopupData] = useState(null)
  const [orderDetails, setOrderDetails] = useState({}) // 주문별 운송사 및 송장 정보 상태

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId],
    )
  }

  const handleOpenPopup = (order) => {
    setPopupData(order)
  }

  const handleClosePopup = () => {
    setPopupData(null)
  }

  const handleCourierChange = (orderId, value) => {
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [orderId]: {
        ...prevDetails[orderId],
        courier: value,
      },
    }))
  }

  const handleTrackingNumberChange = (orderId, value) => {
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [orderId]: {
        ...prevDetails[orderId],
        trackingNumber: value,
      },
    }))
  }

  const handleSubmitOrder = (orderId) => {
    const { courier, trackingNumber } = orderDetails[orderId] || {}

    if (!courier || !trackingNumber) {
      alert('운송사와 송장번호를 모두 입력해주세요.')
      return
    }

    // 발주 처리 로직 (예: API 호출)
    console.log(`주문 ${orderId}에 대한 발주 처리 중...`)
    console.log(`운송사: ${courier}, 송장번호: ${trackingNumber}`)

    // 발주 완료 후 상태 업데이트
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [orderId]: {
        ...prevDetails[orderId],
        submitted: true,
      },
    }))
  }

  const orderList = [
    {
      orderId: 1001,
      productId: 501,
      productName: '무선 이어폰',
      option: '블랙',
      quantity: 2,
      status: '결제완료',
      orderDate: '2025-01-20',
    },
    {
      orderId: 1002,
      productId: 502,
      productName: '스마트폰 케이스',
      option: '투명 강화유리',
      quantity: 1,
      status: '상품준비중',
      orderDate: '2025-01-19',
    },
    {
      orderId: 1003,
      productId: 503,
      productName: '게이밍 키보드',
      option: 'RGB 백라이트',
      quantity: 1,
      status: '배송지시',
      orderDate: '2025-01-18',
    },
  ]

  return (
    <div>
      <h1>주문 관리</h1>
      <table border='1' style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>선택</th>
            <th>주문 번호</th>
            <th>상품명</th>
            <th>옵션/수량</th>
            <th>주문 상태</th>
            <th>송장 입력</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => {
            const details = orderDetails[order.orderId] || {}
            return (
              <tr key={order.orderId}>
                <td>
                  <input
                    type='checkbox'
                    checked={selectedOrders.includes(order.orderId)}
                    onChange={() => handleSelectOrder(order.orderId)}
                    disabled={order.status !== '결제완료'}
                  />
                </td>
                <td>{order.orderId}</td>
                <td>
                  {order.status === '결제완료' ? (
                    <button onClick={() => handleOpenPopup(order)}>{order.productName}</button>
                  ) : (
                    order.productName
                  )}
                </td>
                <td>
                  {order.option} / {order.quantity}
                </td>
                <td>{order.status}</td>
                <td>
                  {order.status === '결제완료' && !details.submitted ? (
                    <div>
                      <select
                        value={details.courier || ''}
                        onChange={(e) => handleCourierChange(order.orderId, e.target.value)}
                      >
                        <option value=''>택배사 선택</option>
                        <option value='CJ대한통운'>CJ대한통운</option>
                        <option value='한진택배'>한진택배</option>
                        <option value='로젠택배'>로젠택배</option>
                      </select>
                      <input
                        type='text'
                        placeholder='송장 번호 입력'
                        value={details.trackingNumber || ''}
                        onChange={(e) => handleTrackingNumberChange(order.orderId, e.target.value)}
                      />
                      <button onClick={() => handleSubmitOrder(order.orderId)}>발주하기</button>
                    </div>
                  ) : details.submitted ? (
                    <div>
                      <p>운송사: {details.courier}</p>
                      <p>송장번호: {details.trackingNumber}</p>
                    </div>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {popupData && <OrderPopup order={popupData} onClose={handleClosePopup} />}
    </div>
  )
}

export default Orders
