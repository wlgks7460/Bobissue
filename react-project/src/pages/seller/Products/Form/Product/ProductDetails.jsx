import React from 'react'

const ProductDetails = ({ product, setProduct }) => {
  return (
    <div className='w-full max-w-lg rounded-[15px] mt-5 p-4 border border-cyan-500 bg-gray-50 space-y-4'>
      <h2 className='text-[16px] font-bold'>상품 주요 정보</h2>

      {/* 가격 입력 */}
      <div className='flex space-x-4'>
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>상품 가격</label>
          <input
            className='w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            type='number'
            min='0'
            value={product.price}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
            }
            placeholder='상품 가격'
          />
        </div>
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>할인 가격</label>
          <input
            className='w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            type='number'
            min='0'
            value={product.salePrice}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))
            }
            placeholder='할인 가격'
          />
        </div>
      </div>

      {/* 재고 수량 */}
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>재고 수량</label>
        <input
          className='w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          type='number'
          min='0'
          value={product.stock}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, stock: parseInt(e.target.value, 10) || 0 }))
          }
          placeholder='재고 수량'
        />
      </div>

      {/* 상품 설명 */}
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>상품 설명</label>
        <textarea
          className='w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={product.description}
          onChange={(e) => setProduct((prev) => ({ ...prev, description: e.target.value }))}
          placeholder='상품의 특징을 입력해주세요'
          rows={4}
        />
      </div>
    </div>
  )
}

export default ProductDetails
