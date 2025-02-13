import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchFilter from './Form/SearchFilter'
import API from '../../../utils/API'

const Search = () => {
  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const debug_mode = localStorage.getItem('debug_mode') === 'true'

  useEffect(() => {
    if (debug_mode) {
      console.log('debug')
      return
    }
    const fetchAllProducts = async () => {
      try {
        const response = await API.get('/item')
        console.log('📌 API 응답 데이터:', response.data)

        if (response.data.status === 'OK' && Array.isArray(response.data.result?.data)) {
          // ✅ 상품 데이터 가공 (유니크 ID 추가 및 companyNo 변경 반영)
          const cleanData = response.data.result.data.map((item, index) => ({
            ...item,
            uniqueId: `${item.itemNo}-${index}`,
            imageUrl: item.images?.[0]?.imageUrl || '', // 첫 번째 이미지 가져오기
            categoryName: item.category?.name || '카테고리 없음',
            parentCategory: item.category?.parentName || '상위 카테고리 없음',
            companyNo: item.company?.companyNo || null, // ✅ 변경된 company 구조 반영
            companyName: item.company?.name || '회사 없음', // ✅ 회사명 가져오기
          }))
          console.log(cleanData)
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

  // ✅ 필터 적용 함수 (companyNo → company로 변경 반영)
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

  // ✅ 상세 페이지 이동
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
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-200 text-left'>
                <th className='border px-4 py-2 w-[80px]'>번호</th>
                <th className='border px-4 py-2 w-[150px]'>이미지</th>
                <th className='border px-4 py-2 w-[250px]'>상품명</th>
                <th className='border px-4 py-2 w-[200px]'>회사명</th>
                <th className='border px-4 py-2 w-[150px]'>가격</th>
                <th className='border px-4 py-2 w-[150px]'>할인 가격</th>
                <th className='border px-4 py-2 w-[200px]'>카테고리</th>
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
                  <td className='border px-4 py-2 text-center'>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className='w-16 h-16 object-cover rounded-md'
                      />
                    ) : (
                      '이미지 없음'
                    )}
                  </td>
                  <td className='border px-4 py-2 text-blue-500'>{product.name}</td>
                  <td className='border px-4 py-2'>{product.companyName}</td> {/* ✅ 공백 제거 */}
                  <td className='border px-4 py-2'>{product.price?.toLocaleString() || '0'} 원</td>
                  <td className='border px-4 py-2'>
                    {product.salePrice?.toLocaleString() || '0'} 원
                  </td>
                  <td className='border px-4 py-2'>
                    {product.parentCategory} &gt; {product.categoryName}
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
