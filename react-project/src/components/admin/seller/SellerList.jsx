import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'
import { Search } from 'lucide-react' // ✅ 아이콘 추가

const SellerListTable = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자관리' }, { name: '판매자 전체목록' }]

  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchType, setSearchType] = useState('email')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [sellerItems, setSellerItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [showProducts, setShowProducts] = useState(false) // 상품 목록 표시 여부

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await API.get('/sellers')
        console.log('📢 서버 응답:', response) // 응답 확인

        setSellers(response.data.result.data)
      } catch (error) {
        console.error('판매자 목록 조회 실패:', error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSellers()
  }, [])

  // 특정 판매자의 상품 목록 조회
  const fetchSellerItems = async (sellerNo) => {
    setItemsLoading(true)
    try {
      const response = await API.get(`/item`)
      const allItems = response.data.result.data
      const sellerProducts = allItems.filter((item) => item.companyNo === sellerNo)
      setSellerItems(sellerProducts)
    } catch (error) {
      console.error('판매자의 상품 목록 조회 실패:', error)
      setSellerItems([])
    } finally {
      setItemsLoading(false)
    }
  }

  // 판매자 클릭 시 상세 정보 + 상품 목록 조회
  const handleSellerClick = (seller) => {
    if (selectedSeller?.companyNo === seller.companyNo) {
      setShowProducts(!showProducts) // 토글
    } else {
      setSelectedSeller(seller)
      fetchSellerItems(seller.companyNo)
      setShowProducts(true)
    }
  }

  // 검색 버튼 핸들러
  const handleSearch = () => {
    console.log('검색 실행:', searchType, searchQuery)
  }

  const filteredSellers = sellers.filter((seller) =>
    searchQuery
      ? String(seller[searchType]).toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  )

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 전체 목록</h1>

      {/* 검색 필터 */}
      <h2 className='text-lg font-semibold mb-4'>| 검색</h2>
      <div className='flex space-x-4 mb-6 items-end'>
        <div>
          <label className='block text-sm font-medium mb-1'>검색 기준</label>
          <select
            className='border rounded-md px-3 py-2 h-10'
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value='name'>이름</option>
            <option value='companyNo'>회원번호</option>
            <option value='email'>이메일</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>검색 입력</label>
          <input
            type='text'
            className='border rounded-md px-3 py-2 h-10 w-full'
            placeholder='검색어를 입력하세요'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={handleSearch}
          className='bg-blue-500 text-white px-4 h-10 rounded-md flex items-center justify-center'
        >
          검색
        </button>
      </div>

      {loading ? (
        <p className='text-center text-gray-500'>로딩 중...</p>
      ) : error ? (
        <p className='text-center text-red-500'>데이터를 불러오는 중 오류가 발생했습니다.</p>
      ) : (
        <>
          <h2 className='text-lg font-semibold mt-8 mb-4'>| 조회 결과</h2>
          <table className='table-auto w-full border'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2'>회원번호</th>
                <th className='border px-4 py-2'>이름</th>
                <th className='border px-4 py-2'>이메일</th>
                <th className='border px-4 py-2'>전화번호</th>
                <th className='border px-4 py-2'>계정 상태</th>
                <th className='border px-4 py-2'>판매 상품</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <tr key={seller.companyNo}>
                    <td className='border px-4 py-2 text-center'>{seller.companyNo}</td>
                    <td className='border px-4 py-2 text-center'>{seller.name}</td>
                    <td className='border px-4 py-2 text-center'>{seller.email}</td>
                    <td className='border px-4 py-2 text-center'>{seller.callNumber}</td>
                    <td className='border px-4 py-2 text-center'>
                      {seller.status === 'Y' ? '활성' : '비활성'}
                    </td>
                    <td className='border px-4 py-2 text-center'>
                      <button
                        onClick={() => handleSellerClick(seller)}
                        className='p-2 rounded-full bg-transparent hover:bg-gray-200 transition duration-200'
                        title='판매 상품 보기'
                      >
                        <Search size={18} className='text-gray-700' />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='border px-4 py-2 text-center text-gray-500'>
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* 판매자 상품 목록 (토글 가능) */}
      {selectedSeller && showProducts && (
        <div className='mt-6 p-4 border rounded-lg bg-gray-50'>
          <h2 className='text-xl font-bold'>{selectedSeller.name}님의 판매 상품</h2>
          {itemsLoading ? (
            <p className='text-gray-500'>상품 목록 로딩 중...</p>
          ) : sellerItems.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
              {sellerItems.map((item) => (
                <div key={item.itemNo} className='border p-4 rounded-lg bg-white shadow'>
                  <img
                    src={item.images.length > 0 ? item.images[0].imageUrl : '/no-image.png'}
                    alt={item.name}
                    className='w-full h-40 object-cover rounded-md mb-2'
                  />
                  <h3 className='text-lg font-semibold'>{item.name}</h3>
                  <p className='text-sm text-gray-600'>{item.description}</p>
                  <p className='text-md font-bold mt-2'>
                    {item.salePrice ? (
                      <>
                        <span className='line-through text-gray-500'>{item.price}원</span>{' '}
                        <span className='text-red-500'>{item.salePrice}원</span>
                      </>
                    ) : (
                      <span>{item.price}원</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500'>등록된 상품이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SellerListTable
