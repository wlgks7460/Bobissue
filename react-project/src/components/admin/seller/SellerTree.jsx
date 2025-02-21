import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'
import { useInView } from 'react-intersection-observer' // 라이브러리 import

const SellerTreeStructure = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자관리' }, { name: '판매자 트리구조' }]
  const [treeData, setTreeData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [displayedData, setDisplayedData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('companyName')
  const [hasMore, setHasMore] = useState(true)
  const itemsPerPage = 5 // 한 번에 로드할 개수

  // Intersection Observer Hook (마지막 요소 감지)
  const { ref, inView } = useInView({ threshold: 1 })

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await API.get('/admin/seller-approvals')
        const formattedData = formatTreeData(response.data.result.data)
        setTreeData(formattedData)
        setFilteredData(formattedData)
        setDisplayedData(formattedData.slice(0, itemsPerPage)) // 초기 데이터
      } catch (err) {
        console.error('트리 데이터 불러오기 실패:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTreeData()
  }, [])

  // 📌 대표 판매자 판별 및 트리 구조 변환
  const formatTreeData = (data) => {
    return data
      .filter((company) => company.sellers.length > 1) // 추가 계정이 있는 회사만 필터링
      .map((company) => {
        let representativeSeller =
          company.sellers.length === 1
            ? company.sellers[0]
            : company.sellers.reduce((prev, curr) => (prev.sellerNo < curr.sellerNo ? prev : curr))

        return {
          companyNo: company.companyNo,
          companyName: company.companyName,
          license: company.license,
          bank: company.bank,
          bankAccount: company.bankAccount,
          representativeSeller,
          sellers: company.sellers,
        }
      })
  }

  // 📌 검색 기능 (회사 이름 또는 대표 이메일 기준)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredData(treeData)
      setDisplayedData(treeData.slice(0, itemsPerPage))
      return
    }

    const filtered = treeData.filter((company) => {
      const searchField =
        searchType === 'companyName'
          ? company.companyName.toLowerCase()
          : company.representativeSeller.email.toLowerCase()
      return searchField.includes(searchQuery.toLowerCase())
    })

    setFilteredData(filtered)
    setDisplayedData(filtered.slice(0, itemsPerPage))
    setHasMore(filtered.length > itemsPerPage)
  }

  // 📌 무한 스크롤 데이터 로드
  useEffect(() => {
    if (inView && hasMore) {
      setTimeout(() => {
        const newLength = displayedData.length + itemsPerPage
        setDisplayedData(filteredData.slice(0, newLength))
        if (newLength >= filteredData.length) {
          setHasMore(false)
        }
      }, 500)
    }
  }, [inView, hasMore])

  return (
    <div className='p-6 bg-white min-h-screen'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 트리구조</h1>

      {/* 📌 가이드 추가 */}
      <div className='bg-yellow-100 p-4 rounded-md mb-6'>
        <p className='text-yellow-700 font-medium'>
          ※ 추가 계정을 보유한 회사들을 관리하는 페이지입니다. 대표 판매자 및 추가 판매자 계정을
          확인할 수 있습니다.
        </p>
      </div>
      <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>

      {/* 🔍 검색 기능 추가 */}
      <div className='mb-4 flex flex-col sm:flex-row gap-4 items-center'>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className='border border-gray-300 rounded-md px-3 py-2 w-48'
        >
          <option value='companyName'>회사 이름</option>
          <option value='representativeEmail'>대표 이메일</option>
        </select>

        <input
          type='text'
          placeholder='검색어 입력'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='border border-gray-300 rounded-md px-3 py-2 w-80'
        />
        <button onClick={handleSearch} className='bg-blue-500 text-white px-4 py-2 rounded-md'>
          검색
        </button>
      </div>

      {loading ? (
        <p className='text-center text-gray-500'>데이터 로딩 중...</p>
      ) : error ? (
        <p className='text-center text-red-500'>데이터를 불러오는 중 오류가 발생했습니다.</p>
      ) : displayedData.length === 0 ? (
        <p className='text-center text-gray-500'>조회 결과가 존재하지 않습니다.</p>
      ) : (
        <div className='ml-4 border-l-2 border-gray-300 pl-4'>
          {displayedData.map((company, index) => (
            <div key={company.companyNo} className='mb-6'>
              <div className='bg-gray-100 p-4 rounded-lg shadow-md'>
                <p className='text-lg font-bold text-blue-700'>{company.companyName}</p>
                <p className='text-sm text-gray-600'>
                  대표 판매자: {company.representativeSeller.name}
                </p>
                <p className='text-sm text-gray-600'>
                  이메일: {company.representativeSeller.email}
                </p>
                <p className='text-sm text-gray-600'>
                  승인 상태:{' '}
                  {company.representativeSeller.approvalStatus === 'Y' ? '✅ 승인됨' : '⏳ 대기 중'}
                </p>
              </div>

              {company.sellers.length > 1 && (
                <div className='ml-6 border-l-2 border-gray-300 pl-4 mt-2'>
                  {company.sellers
                    .filter((seller) => seller.sellerNo !== company.representativeSeller.sellerNo)
                    .map((seller) => (
                      <div
                        key={seller.sellerNo}
                        className='bg-blue-50 p-3 rounded-lg mt-2 shadow-sm'
                      >
                        <p className='text-sm font-semibold'>{seller.name}</p>
                        <p className='text-xs text-gray-500'>이메일: {seller.email}</p>
                      </div>
                    ))}
                </div>
              )}
              {/* Intersection Observer 적용 (마지막 요소 감지) */}
              {index === displayedData.length - 1 && <div ref={ref} className='h-10' />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SellerTreeStructure
