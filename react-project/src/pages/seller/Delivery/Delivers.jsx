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
    <div className='min-h-screen bg-gradient-to-r bg-blue-50 py-10 px-5 sm:px-10'>
      <div className='max-w-7xl mx-auto'>
        {/* 헤더 */}
        <div className='text-center mb-10'>
          <h1 className='text-5xl font-extrabold text-gray-900'>배송 관리</h1>
          <p className='mt-2 text-xl text-gray-600'>배송 상태에 따라 상품을 관리하세요.</p>
        </div>

        {/* 탭 UI */}
        <div className='flex justify-center mb-8'>
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
              className={`px-3 py-1 mx-2 rounded-full text-lg font-semibold transition-all duration-300 transform ${
                selectedTab === key
                  ? 'bg-gray-600 text-white scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 배송 리스트 카드 UI */}
        <div className='grid grid-cols-1 rounded-[20px] sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredDelivers.length === 0 ? (
            <div className='col-span-3 text-center text-gray-500'>해당 분류의 배송이 없습니다.</div>
          ) : (
            filteredDelivers.map((deliver) => (
              <div
                key={deliver.id}
                className='bg-white p-4 py-6 rounded-[20px] border-2 border-gray-300 hover:scale-95 transition-all duration-200 cursor-pointer'
                onClick={() => handleOpenPopup(deliver)}
              >
                <h3 className='text-xl font-semibold text-gray-800'>{deliver.product}</h3>
                <p className='text-gray-600 mt-2'>상태: {deliver.status}</p>
                <p className='text-gray-500 mt-4'>{deliver.details}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 상품 상세 정보 팝업 */}
      {selectedProduct && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[350px]'>
            <h2 className='text-2xl font-bold mb-4'>{selectedProduct.product}</h2>
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
