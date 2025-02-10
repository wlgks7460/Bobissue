import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MonitorProducts = () => {
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '판매자 관리' },
    { name: '모니터링' },
    { name: '상품현황' },
  ]

  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await API.get('/item')
      if (response.data.status === 'OK') {
        setProducts(response.data.result.data)
        setFilteredProducts(response.data.result.data)
      }
    } catch (error) {
      console.error('상품 조회 오류:', error)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchClick = () => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }

  const handleProductClick = (itemNo) => {
    navigate(`/admin/seller/monitor/products/${itemNo}`)
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>상품 현황</h1>

      {/* 검색 바와 조회 버튼 */}
      <div className='mb-4 flex items-center space-x-2'>
        <input
          type='text'
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='상품 이름 또는 카테고리를 검색하세요'
          className='border border-gray-300 rounded-md px-4 py-2 w-1/2' // 🔹 검색창의 너비를 50%로 설정
        />
        <button
          onClick={handleSearchClick}
          className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition'
        >
          조회
        </button>
      </div>

      {/* 상품 목록 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredProducts.map((product) => (
          <div
            key={product.itemNo}
            className='p-4 border rounded-md shadow-md hover:shadow-lg cursor-pointer'
            onClick={() => handleProductClick(product.itemNo)}
          >
            <img
              src={product.images.length > 0 ? product.images[0].imageUrl : ''}
              alt={product.name}
              className='w-full h-40 object-cover mb-4'
            />
            <h2 className='text-lg font-bold'>{product.name}</h2>
            <p className='text-sm text-gray-600'>
              카테고리: {product.category.parentName} &gt; {product.category.name}
            </p>
            <p className='text-sm text-gray-600'>가격: {product.price}원</p>
            <p className='text-sm text-gray-600'>할인가: {product.salePrice}원</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonitorProducts
