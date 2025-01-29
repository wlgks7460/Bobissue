import React from 'react'
import { Link } from 'react-router-dom'

const SMain = () => {
  return (
    <div>
      <div>기본 페이지 내용입니다.</div>
      <div>
        상품이 없다면
        <div>
          <h1>새 상품 등록 페이지로 이동합니다.</h1>
          <Link to='products/register' style={{ backgroundColor: 'yellow' }}>
            <button>상품 등록하기</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SMain
