import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'
import SearchFilter from './Form/SearchFilter'
import API from '../../../utils/API'

const Search = () => {
  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 5
  const pagesPerGroup = 5
  const debug_mode = localStorage.getItem('debug_mode') === 'true'

  useEffect(() => {
    if (debug_mode) {
      console.log('debug')
      return
    }
    const fetchAllProducts = async () => {
      try {
        const response = await API.get('/sellers/item')

        if (response.status === 200 && Array.isArray(response.data.result?.data)) {
          const cleanData = response.data.result.data.map((item, index) => ({
            ...item,
            uniqueId: `${item.itemNo}-${index}`,
            imageUrl: item.images?.[0]?.imageUrl || '',
            categoryName: item.category?.name || '카테고리 없음',
            parentCategory: item.category?.parentName || '상위 카테고리 없음',
            companyNo: item.company?.companyNo || null,
            companyName: item.company?.name || '회사 없음',
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
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }

  const handleClickNavigate = (productId) => {
    navigate(`/seller/products/view/${productId}`)
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages)
  const displayedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  return (
    <div className='p-6 bg-white'>
      <h1 className='font-bold text-2xl mb-10'>상품 조회</h1>
      <SearchFilter onSearch={applyFilters} />
      <div className='mt-6 p-6 border rounded-lg bg-white shadow-md'>
        {displayedProducts.length === 0 ? (
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
              {displayedProducts.map((product, index) => (
                <tr
                  key={product.uniqueId}
                  className='border-b hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleClickNavigate(product.itemNo)}
                >
                  <td className='border px-4 py-2 text-center'>{(currentPage - 1) * productsPerPage + index + 1}</td>
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
                  <td className='border px-4 py-2'>{product.companyName}</td>
                  <td className='border px-4 py-2'>{product.price?.toLocaleString() || '0'} 원</td>
                  <td className='border px-4 py-2'>{product.salePrice?.toLocaleString() || '0'} 원</td>
                  <td className='border px-4 py-2'>{product.parentCategory} &gt; {product.categoryName}</td>
                  <td className='border px-4 py-2'>{product.description || '설명 없음'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className='flex justify-center mt-6'>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'>
              <FaAngleDoubleLeft />
            </button>
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'>
              <FaAngleLeft />
            </button>
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`mx-1 px-4 py-2 rounded-md text-lg font-medium transition ${currentPage === page ? 'bg-gray-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-400 hover:text-white'}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'>
              <FaAngleRight />
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'>
              <FaAngleDoubleRight />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
