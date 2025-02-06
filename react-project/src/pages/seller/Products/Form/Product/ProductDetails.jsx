import React from 'react'

const ProductDetails = ({ product, setProduct }) => {
  return (
    <div className='w-[700px] mt-5 p-2 border border-black bg-gray-50 space-y-2'>
      <h2 className='text-[16px] font-bold'>상품 주요 정보</h2>

      {/* 가격 입력 */}
      <div className='space-x-4'>
        <input
          className='w-[300px] p-2 border-b-2 border-black'
          type='number'
          value={product.price}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
          }
          placeholder='상품 가격'
        />
        <input
          className='w-[300px] p-2 border-b-2 border-black'
          type='number'
          value={product.salePrice}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))
          }
          placeholder='할인 가격'
        />
      </div>

      {/* 재고 수량 */}
      <input
        className='w-[300px] p-2 border-b-2 border-black'
        type='number'
        value={product.stock}
        onChange={(e) =>
          setProduct((prev) => ({ ...prev, stock: parseInt(e.target.value, 10) || 0 }))
        }
        placeholder='재고 수량'
      />

      {/* 상품 설명 */}
      <textarea
        className='w-[600px] mt-2 p-3 border border-black h-[100px]'
        value={product.description}
        onChange={(e) => setProduct((prev) => ({ ...prev, description: e.target.value }))}
        placeholder='상품의 특징을 입력해주세요'
      ></textarea>
    </div>
  )
}

export default ProductDetails
