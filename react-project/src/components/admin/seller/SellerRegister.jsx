import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const SellerRegister = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자관리' }, { name: '판매자 신규신청' }]

  const [approvals, setApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 승인 완료 판매자 검색 관련 state
  const [approvedSearchQuery, setApprovedSearchQuery] = useState('')
  const [approvedAppliedSearchQuery, setApprovedAppliedSearchQuery] = useState('')
  const [approvedSearchType, setApprovedSearchType] = useState('sellerNo')

  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
  const itemsPerPage = 5 // 한 페이지에 표시할 항목 개수
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await API.get('/admin/seller-approvals')
        console.log('📢 API 응답 데이터:', response.data.result.data)
        setApprovals(response.data.result.data)
      } catch (err) {
        console.error('판매상태 조회 실패:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApprovals()
  }, [])

  // ✅ 승인 대기 판매자 목록 (approvalStatus: "N" & status: "Y"인 경우만)
  const pendingSellers = approvals.flatMap((company) =>
    company.sellers
      .filter((seller) => seller.approvalStatus === 'N' && seller.status === 'Y')
      .map((seller) => ({ ...seller, companyInfo: company })),
  )
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = pendingSellers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(pendingSellers.length / itemsPerPage)

  // 승인 완료 판매자 목록 (approvalStatus: "Y")
  const approvedSellers = approvals.flatMap((company) =>
    company.sellers
      .filter((seller) => seller.approvalStatus === 'Y')
      .map((seller) => ({ ...seller, companyInfo: company })),
  )

  console.log('✔ 승인 완료 판매자 목록:', approvedSellers)

  // 승인 완료 목록 검색 옵션
  const approvedSearchOptions = [
    { value: 'sellerNo', label: '판매자번호' },
    { value: 'name', label: '판매자명' },
    { value: 'email', label: '이메일' },
    { value: 'callNumber', label: '전화번호' },
  ]

  // 승인 완료 목록 필터링 (정확한 일치)
  const filteredApprovedSellers = approvedSellers.filter((seller) => {
    if (!approvedAppliedSearchQuery) return true
    const fieldValue = seller[approvedSearchType]
    return (
      String(fieldValue).trim().toLowerCase() === approvedAppliedSearchQuery.trim().toLowerCase()
    )
  })

  console.log('🔍 필터링된 승인 완료 목록:', filteredApprovedSellers)

  // 판매자 승인 처리 함수
  const handleApproveSeller = async (companyNo, sellerNo) => {
    if (!window.confirm('해당 판매자를 승인 상태로 변경하시겠습니까?')) return

    try {
      const response = await API.put(`/admin/${sellerNo}/approve`)
      console.log('판매자 승인 응답:', response)

      setApprovals((prevApprovals) =>
        prevApprovals.map((company) => {
          if (company.companyNo === companyNo) {
            return {
              ...company,
              sellers: company.sellers.map((seller) =>
                seller.sellerNo === sellerNo ? { ...seller, approvalStatus: 'Y' } : seller,
              ),
              statistics: {
                ...company.statistics,
                approvedCount: company.statistics.approvedCount + 1,
                pendingCount: company.statistics.pendingCount - 1,
              },
            }
          }
          return company
        }),
      )
    } catch (error) {
      console.error('판매자 승인 실패:', error)
      alert('판매자 승인이 실패했습니다.')
    }
  }
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // 승인 완료 목록 검색 처리
  const handleApprovedSearch = () => {
    console.log('Approved search 실행:', approvedSearchType, approvedSearchQuery)
    setApprovedAppliedSearchQuery(approvedSearchQuery)
  }

  return (
    <div className='p-6 bg-white min-h-screen'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 신규신청</h1>

      {/* 승인 대기 판매자 목록 */}
      <div className='mb-8'>
        <h2 className='text-lg font-semibold mb-4'>| 승인 대기 판매자 목록</h2>
        <table className='min-w-full border border-gray-300'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='border px-4 py-2'>판매자번호</th>
              <th className='border px-4 py-2'>판매자명</th>
              <th className='border px-4 py-2'>이메일</th>
              <th className='border px-4 py-2'>전화번호</th>
              <th className='border px-4 py-2'>회사정보</th>
              <th className='border px-4 py-2'>승인</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((seller) => (
                <tr key={seller.sellerNo} className='hover:bg-gray-100'>
                  <td className='border px-4 py-2 text-center'>{seller.sellerNo}</td>
                  <td className='border px-4 py-2'>{seller.name}</td>
                  <td className='border px-4 py-2'>{seller.email}</td>
                  <td className='border px-4 py-2 text-center'>{seller.callNumber}</td>
                  <td className='border px-4 py-2'>
                    <div className='text-sm'>
                      <strong>{seller.companyInfo.companyName}</strong> (회사번호:{' '}
                      {seller.companyInfo.companyNo})
                      <br />
                      라이센스: {seller.companyInfo.license}
                      <br />
                      은행: {seller.companyInfo.bank} | 계좌: {seller.companyInfo.bankAccount}
                    </div>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() =>
                        handleApproveSeller(seller.companyInfo.companyNo, seller.sellerNo)
                      }
                      className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600'
                    >
                      승인
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='border px-4 py-2 text-center text-gray-500'>
                  승인 대기 판매자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ 승인 완료 판매자 목록 (회사 정보 포함) */}
      <div className='mb-8'>
        <h2 className='text-lg font-semibold mb-4'>| 승인 완료 판매자 목록</h2>
        {/* ✅ 승인 완료 목록 검색창 추가 */}
        <div className='mb-4'>
          <div className='flex flex-col sm:flex-row sm:items-end gap-4'>
            <div className='flex-1'>
              <select
                value={approvedSearchType}
                onChange={(e) => setApprovedSearchType(e.target.value)}
                className='w-full border rounded-md px-3 py-2'
              >
                {approvedSearchOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex-1'>
              <input
                type='text'
                placeholder='검색어 입력'
                value={approvedSearchQuery}
                onChange={(e) => setApprovedSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApprovedSearch()}
                className='w-full border rounded-md px-3 py-2'
              />
            </div>
            <div>
              <button
                onClick={handleApprovedSearch}
                className='bg-blue-500 text-white px-6 py-2 rounded-md'
              >
                조회
              </button>
            </div>
          </div>
        </div>

        <table className='min-w-full border border-gray-300'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='border px-4 py-2'>판매자번호</th>
              <th className='border px-4 py-2'>판매자명</th>
              <th className='border px-4 py-2'>이메일</th>
              <th className='border px-4 py-2'>전화번호</th>
              <th className='border px-4 py-2'>회사정보</th>
            </tr>
          </thead>
          <tbody>
            {filteredApprovedSellers.map((seller) => (
              <tr key={seller.sellerNo} className='hover:bg-gray-100'>
                <td className='border px-4 py-2 text-center'>{seller.sellerNo}</td>
                <td className='border px-4 py-2'>{seller.name}</td>
                <td className='border px-4 py-2'>{seller.email}</td>
                <td className='border px-4 py-2 text-center'>{seller.callNumber}</td>
                <td className='border px-4 py-2'>
                  <div className='text-sm'>
                    <strong>{seller.companyInfo.companyName}</strong> (회사번호:{' '}
                    {seller.companyInfo.companyNo})
                    <br />
                    라이센스: {seller.companyInfo.license}
                    <br />
                    은행: {seller.companyInfo.bank} | 계좌: {seller.companyInfo.bankAccount}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerRegister
