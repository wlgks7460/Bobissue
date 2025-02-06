import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchFilter from './Form/SearchFilter'
import API from '../../../utils/API'

const Search = () => {
  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState([]) // 전체 상품 리스트
  const [filteredProducts, setFilteredProducts] = useState([]) // 필터링된 상품 리스트

  // API에서 전체 상품 가져오기
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await API.get('/item')
        console.log(response.data)
        if (response.data.status === 'OK') {
          setAllProducts(response.data.result.data)
          setFilteredProducts(response.data.result.data)
        } else {
          console.error('상품 조회 실패:', response.data.message.label)
        }
      } catch (error) {
        console.error('API 요청 실패:', error)
      }
    }

    fetchAllProducts()
  }, [])

  // 검색 필터 적용
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

      {/* 검색 필터 */}
      <SearchFilter onSearch={applyFilters} />

      {/* 검색 결과 리스트 */}
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
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.itemNo}
                  className='border-b hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleClickNavigate(product.itemNo)}
                >
                  <td className='border px-4 py-2 text-center'>{index + 1}</td>
                  <td className='border px-4 py-2 text-blue-500'>{product.name}</td>
                  <td className='border px-4 py-2'>{product.companyNo}</td>
                  <td className='border px-4 py-2'>{product.price.toLocaleString()} 원</td>
                  <td className='border px-4 py-2'>{product.salePrice.toLocaleString()} 원</td>
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
