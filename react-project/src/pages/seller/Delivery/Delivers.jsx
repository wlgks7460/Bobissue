import React, { useState } from 'react'

const Delivers = () => {
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null) // 상품 상세 정보 상태

  const dummyDelivers = [
    {
      id: 'D001',
      product: '무선 충전기',
      status: 'preparing',
      details: '고속 충전 지원 / 무선 범위 10m',
    },
    {
      id: 'D002',
      product: '게이밍 키보드',
      status: 'shipping',
      details: 'RGB 백라이트 / 기계식 스위치',
    },
    {
      id: 'D003',
      product: '노트북 거치대',
      status: 'delivered',
      details: '알루미늄 재질 / 각도 조절 가능',
    },
    {
      id: 'D004',
      product: '무선 마우스',
      status: 'confirmed',
      details: '초고속 응답속도 / 인체공학 디자인',
    },
  ]

  const filteredDelivers =
    selectedTab === 'all'
      ? dummyDelivers
      : dummyDelivers.filter((deliver) => deliver.status === selectedTab)

  const handleOpenPopup = (product) => {
    setSelectedProduct(product)
  }

  const handleClosePopup = () => {
    setSelectedProduct(null)
  }

  return (
    <div className='p-6 w-full bg-gray-50 min-h-screen'>
      <h1 className='text-2xl text-center font-bold text-gray-800 mb-6'>배송 관리</h1>

      {/* 탭 UI */}
      <div className='flex space-x-4 justify-center text-lg font-medium my-6'>
        {[
          { key: 'all', label: '전체' },
          { key: 'preparing', label: '상품준비 중' },
          { key: 'shipping', label: '배송중' },
          { key: 'delivered', label: '배송완료' },
          { key: 'confirmed', label: '구매확정' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedTab(key)}
            className={`px-3 py-1 text-white rounded-[15px] transition ${selectedTab === key ? 'bg-amber-500 text-white' : 'bg-rose-300 hover:bg-rose-400'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 배송 리스트 */}
      <div className='border border-gray-300 rounded-xl bg-white p-4'>
        {filteredDelivers.map((deliver) => (
          <div key={deliver.id} className='flex justify-between p-4 border-b'>
            <button
              onClick={() => handleOpenPopup(deliver)}
              className='text-blue-600 hover:underline'
            >
              {deliver.product}
            </button>
            <button className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700'>
              배송 취소
            </button>
          </div>
        ))}
      </div>

      {/* 상품 상세 정보 팝업 */}
      {selectedProduct && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[300px]'>
            <h2 className='text-xl font-bold mb-4'>{selectedProduct.product}</h2>
            <p className='text-gray-700'>{selectedProduct.details}</p>
            <button
              onClick={handleClosePopup}
              className='mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800'
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Delivers
