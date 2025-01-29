import React, { useState } from 'react'

const Ship = () => {
  // 출고관련 요구함수
  const [ShippingList, setShippingList] = useState([])

  const Shipping = () => {
    //shippinglist에 출고api로부터 받아온 정보들
  }

  return (
    <div>
      {/* 배송실수 또는 배송 관련해서 문제가 생겨서 배송을 하지 않아야 하는 경우, 만약 배송란에 클릭을
      했다면 ? 배송중인 상품에 대해 출고중지요청을 통해 이 상품의 출고를 취소할 수 있다 */}
      <box>출고중지요청</box>
      <box>출고중지완료</box>
      <div className=''></div>
    </div>
  )
}

export default Ship
