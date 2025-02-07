import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchFilter from './Form/SearchFilter'
import API from '../../../utils/API'

const Search = () => {
  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await API.get('/item')
        console.log('📌 API 응답 데이터:', response.data)

        if (response.data.status === 'OK' && Array.isArray(response.data.result?.data)) {
          // 중복 방지를 위해 `itemNo + index`로 고유한 key 생성
          const cleanData = response.data.result.data.map((item, index) => ({
            ...item,
            uniqueId: `${item.itemNo}-${index}`,
          }))

          setAllProducts(cleanData)
          setFilteredProducts(cleanData)
        } else {
          console.error('상품 조회 실패:', response.data.message?.label || '알 수 없는 오류')
        }
      } catch (error) {
        console.error('API 요청 실패:', error)
      }
    }

    fetchAllProducts()
  }, [])

  const applyFilters = (filters) => {
    let filtered = allProducts

    if (filters.name) {
      filtered = filtered.filter((product) => product.name.includes(filters.name))
    }

    if (filters.companyNo) {
      filtered = filtered.filter((product) => product.companyNo === Number(filters.companyNo))
    }

    setFilteredProducts(filtered)
  }

  const handleClickNavigate = (productId) => {
    navigate(`/seller/products/view/${productId}`)
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-2xl mb-10'>상품 조회</h1>
      <SearchFilter onSearch={applyFilters} />
      <div className='mt-6 p-6 border rounded-lg bg-white'>
        {filteredProducts.length === 0 ? (
          <p className='text-gray-600 text-center'>검색된 상품이 없습니다.</p>
        ) : (
          <table className='w-[1000px] border-collapse'>
            <thead>
              <tr className='bg-gray-200 text-left'>
                <th className='border px-4 py-2 w-[100px]'>번호</th>
                <th className='border px-4 py-2 w-[300px]'>상품명</th>
                <th className='border px-4 py-2 w-[200px]'>회사 번호</th>
                <th className='border px-4 py-2 w-[150px]'>가격</th>
                <th className='border px-4 py-2 w-[200px]'>할인 가격</th>
                <th className='border px-4 py-2 w-[300px]'>설명</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.uniqueId}
                  className='border-b hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleClickNavigate(product.itemNo)}
                >
                  <td className='border px-4 py-2 text-center'>{index + 1}</td>
                  <td className='border px-4 py-2 text-blue-500'>{product.name}</td>
                  <td className='border px-4 py-2'>{product.companyNo?.companyNo}</td>
                  <td className='border px-4 py-2'>{product.price?.toLocaleString() || '0'} 원</td>
                  <td className='border px-4 py-2'>
                    {product.salePrice?.toLocaleString() || '0'} 원
                  </td>
                  <td className='border px-4 py-2'>{product.description || '설명 없음'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Search
