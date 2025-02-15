import React from 'react'

const ProductDetails = ({ product, setProduct }) => {
  return (
    <div className="w-full mx-auto max-w-lg rounded-lg mt-6 p-6 border border-brown-300 bg-white shadow-md space-y-6">
      <h2 className="text-xl font-bold text-brown-800">📌 상품 주요 정보</h2>

      {/* 가격 입력 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brown-700 mb-1">상품 가격</label>
          <input
            className="w-full p-3 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
            type="number"
            min="0"
            value={product.price}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
            }
            placeholder="상품 가격 입력"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brown-700 mb-1">할인 가격</label>
          <input
            className="w-full p-3 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
            type="number"
            min="0"
            value={product.salePrice}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))
            }
            placeholder="할인 가격 입력"
          />
        </div>
      </div>

      {/* 재고 수량 */}
      <div>
        <label className="block text-sm font-medium text-brown-700 mb-1">재고 수량</label>
        <input
          className="w-full p-3 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
          type="number"
          min="0"
          value={product.stock}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, stock: parseInt(e.target.value, 10) || 0 }))
          }
          placeholder="재고 수량 입력"
        />
      </div>

      {/* 상품 설명 */}
      <div>
        <label className="block text-sm font-medium text-brown-700 mb-1">상품 설명</label>
        <textarea
          className="w-full p-3 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
          value={product.description}
          onChange={(e) => setProduct((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="상품의 특징을 입력해주세요"
          rows={4}
        />
      </div>
    </div>
  )
}

export default ProductDetails
