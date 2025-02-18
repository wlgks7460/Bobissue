import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'
import { Search } from 'lucide-react'

const SellerListTable = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자관리' }, { name: '판매자 전체목록' }]
  const navigate = useNavigate()

  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  // 조회 버튼 클릭 시 적용할 검색어 (입력 중에는 결과 노출 X)
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
  // approvalFilter: 'approved' = 회사 등록(판매 승인), 'unapproved' = 회사 미등록(판매 미승인)
  const [approvalFilter, setApprovalFilter] = useState('approved')
  // 검색 조건(검색 타입) – 기본값은 판매자 번호
  const [searchType, setSearchType] = useState('sellerNo')

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await API.get('/sellers')
        console.log('📢 서버 응답:', response)
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

  // approvalFilter 변경 시 검색 조건 기본값을 'sellerNo'로 초기화
  useEffect(() => {
    setSearchType('sellerNo')
  }, [approvalFilter])

  // 판매자 상세 페이지로 이동 (경로: /admin/seller/${seller.sellerNo})
  const handleSellerClick = (seller) => {
    navigate(`/admin/seller/${seller.sellerNo}`)
  }

  // 모든 판매자(승인/미승인)에서 상태 변경 가능하도록 처리
  const handleStatusToggle = async (seller) => {
    console.log(`판매자 상태 변경 요청 전송: sellerNo = ${seller.sellerNo}`)
    try {
      if (!window.confirm('해당 회원 상태를 변경하시겠습니까?')) {
        return
      }
      const response = await API.put(`/admin/${seller.sellerNo}/seller-status`)
      console.log('판매자 상태 변경 응답:', response)
      const newStatus = response.data.result === 'DEACTIVE' ? 'N' : 'Y'
      setSellers((prevSellers) =>
        prevSellers.map((s) => (s.sellerNo === seller.sellerNo ? { ...s, status: newStatus } : s)),
      )
      console.log(`판매자 ${seller.sellerNo} 상태 변경 성공: ${seller.status} -> ${newStatus}`)
    } catch (error) {
      console.error('판매자 상태 변경 실패:', error)
    }
  }

  // 조회 버튼 클릭 시 현재 입력값을 적용하여 필터링
  const handleSearch = () => {
    console.log('검색 실행:', searchType, searchQuery)
    setAppliedSearchQuery(searchQuery)
  }

  // 검색 조건 옵션을 approvalFilter에 따라 구성
  const searchOptions =
    approvalFilter === 'approved'
      ? [
          { value: 'sellerNo', label: '판매자번호' },
          { value: 'companyNo', label: '회사번호' },
          { value: 'name', label: '이름' },
          { value: 'email', label: '이메일' },
          { value: 'callNumber', label: '전화번호' },
          { value: 'status', label: '계정상태' },
        ]
      : [
          { value: 'sellerNo', label: '판매자번호' },
          { value: 'name', label: '이름' },
          { value: 'email', label: '이메일' },
          { value: 'callNumber', label: '전화번호' },
          { value: 'status', label: '계정상태' },
        ]

  // 적용된 검색 조건과 승인 여부에 따라 필터링
  const filteredSellers = sellers.filter((seller) => {
    const fieldValue = seller[searchType]
    const matchesSearch = appliedSearchQuery
      ? searchType === 'sellerNo' || searchType === 'companyNo'
        ? String(fieldValue) === appliedSearchQuery
        : searchType === 'status'
          ? appliedSearchQuery.trim() === '활성'
            ? seller.status === 'Y'
            : appliedSearchQuery.trim() === '비활성'
              ? seller.status === 'N'
              : false
          : String(fieldValue).toLowerCase().includes(appliedSearchQuery.toLowerCase())
      : true

    let matchesApproval = true
    if (approvalFilter === 'approved') {
      matchesApproval = Number(seller.companyNo) !== 0
    } else if (approvalFilter === 'unapproved') {
      matchesApproval = Number(seller.companyNo) === 0
    }
    return matchesSearch && matchesApproval
  })

  return (
    <div className='p-6 bg-white min-h-screen'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-semibold mb-6 text-gray-800'>판매자 전체목록</h1>

      {/* 판매 승인/미승인 토글 */}
      <div className='flex space-x-4 mb-6'>
        <button
          onClick={() => {
            setApprovalFilter('approved')
            console.log('판매 승인 필터 선택')
          }}
          className={`px-4 py-2 rounded-md ${
            approvalFilter === 'approved'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 border'
          }`}
        >
          회사등록 (판매 승인)
        </button>
        <button
          onClick={() => {
            setApprovalFilter('unapproved')
            console.log('판매 미승인 필터 선택')
          }}
          className={`px-4 py-2 rounded-md ${
            approvalFilter === 'unapproved'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 border'
          }`}
        >
          회사미등록 (판매 미승인)
        </button>
      </div>

      {/* 검색 필터 영역 */}
      <div className='p-4 rounded-md shadow mb-6 bg-white'>
        <div className='flex flex-col sm:flex-row sm:items-end gap-4'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-600 mb-1'>검색 기준</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className='w-full border rounded-md px-3 py-2'
            >
              {searchOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-600 mb-1'>검색 입력</label>
            <input
              type='text'
              placeholder='검색어를 입력하세요'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className='w-full border rounded-md px-3 py-2'
            />
          </div>
          <div>
            <button onClick={handleSearch} className='bg-blue-500 text-white px-6 py-2 rounded-md'>
              조회
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className='text-center text-gray-500'>로딩 중...</p>
      ) : error ? (
        <p className='text-center text-red-500'>데이터를 불러오는 중 오류가 발생했습니다.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-white'>
              <tr>
                {approvalFilter === 'approved' ? (
                  <>
                    <th className='px-6 py-3 text-center text-sm font-medium text-gray-600'>
                      판매자번호
                    </th>
                    <th className='px-6 py-3 text-center text-sm font-medium text-gray-600'>
                      회사번호
                    </th>
                  </>
                ) : (
                  <th className='px-6 py-3 text-center text-sm font-medium text-gray-600'>
                    판매자번호
                  </th>
                )}
                <th className='px-6 py-3 text-center text-sm font-medium text-gray-600'>이름</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-gray-600'>이메일</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-gray-600'>
                  전화번호
                </th>
                <th className='px-6 py-3 text-center text-sm font-medium text-gray-600'>
                  계정상태
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <tr key={seller.sellerNo} className='hover:bg-gray-50'>
                    {approvalFilter === 'approved' ? (
                      <>
                        <td className='px-6 py-4 text-center text-gray-700'>{seller.sellerNo}</td>
                        <td className='px-6 py-4 text-center text-gray-700'>{seller.companyNo}</td>
                      </>
                    ) : (
                      <td className='px-6 py-4 text-center text-gray-700'>{seller.sellerNo}</td>
                    )}
                    <td className='px-6 py-4 text-center text-gray-700'>{seller.name}</td>
                    <td className='px-6 py-4 text-center text-gray-700'>{seller.email}</td>
                    <td className='px-6 py-4 text-center text-gray-700'>{seller.callNumber}</td>
                    <td className='px-6 py-4 text-center'>
                      <button
                        onClick={() => handleStatusToggle(seller)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          seller.status === 'Y'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {seller.status === 'Y' ? '활성' : '비활성'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={approvalFilter === 'approved' ? 6 : 5}
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SellerListTable
