import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const SellerRegister = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자관리' }, { name: '판매자 신규신청' }]

  // 전체 회사(판매자 승인) 정보를 담을 state
  const [approvals, setApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Approved sellers 검색 관련 state (승인 완료 판매자)
  const [approvedSearchQuery, setApprovedSearchQuery] = useState('')
  const [approvedAppliedSearchQuery, setApprovedAppliedSearchQuery] = useState('')
  const [approvedSearchType, setApprovedSearchType] = useState('sellerNo')

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await API.get('/admin/seller-approvals')
        console.log('판매상태 전체 조회 응답:', response)
        // 응답 데이터는 response.data.result.data 배열임
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

  // pending sellers: 각 회사의 판매자들 중 approvalStatus가 'N'인 것들 (회사정보 포함)
  const pendingSellers = approvals.flatMap((company) =>
    company.sellers
      .filter((seller) => seller.approvalStatus === 'N')
      .map((seller) => ({ ...seller, companyInfo: company })),
  )

  // all approved sellers: 각 회사의 판매자들 중 approvalStatus가 'Y'인 것들 (회사정보 포함)
  const allApprovedSellers = approvals.flatMap((company) =>
    company.sellers
      .filter((seller) => seller.approvalStatus === 'Y')
      .map((seller) => ({ ...seller, companyInfo: company })),
  )

  // Approved search 옵션: 판매자번호, 판매자명, 이메일, 전화번호 (정확한 일치)
  const approvedSearchOptions = [
    { value: 'sellerNo', label: '판매자번호' },
    { value: 'name', label: '판매자명' },
    { value: 'email', label: '이메일' },
    { value: 'callNumber', label: '전화번호' },
  ]

  // Approved sellers 검색 필터 (정확한 일치: 입력값과 완전히 일치해야 함)
  const filteredApprovedSellers = allApprovedSellers.filter((seller) => {
    if (!approvedAppliedSearchQuery) return true
    const fieldValue = seller[approvedSearchType]
    return (
      String(fieldValue).trim().toLowerCase() === approvedAppliedSearchQuery.trim().toLowerCase()
    )
  })

  // 판매자 승인 처리 함수
  // 승인 API 엔드포인트: /admin/{sellerNo}/approve
  const handleApproveSeller = async (companyNo, sellerNo) => {
    if (!window.confirm('해당 판매자를 판매 가능(승인) 상태로 변경하시겠습니까?')) {
      return
    }
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

  // Approved sellers 검색 처리: 엔터키 또는 조회 버튼
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
              <th className='border px-4 py-2'>계정상태</th>
              <th className='border px-4 py-2'>승인상태</th>
              <th className='border px-4 py-2'>회사정보</th>
              <th className='border px-4 py-2'>승인</th>
            </tr>
          </thead>
          <tbody>
            {pendingSellers.length > 0 ? (
              pendingSellers.map((seller) => (
                <tr key={seller.sellerNo} className='hover:bg-gray-100'>
                  <td className='border px-4 py-2 text-center'>{seller.sellerNo}</td>
                  <td className='border px-4 py-2'>{seller.name}</td>
                  <td className='border px-4 py-2'>{seller.email}</td>
                  <td className='border px-4 py-2 text-center'>{seller.callNumber}</td>
                  <td className='border px-4 py-2 text-center'>
                    {seller.status === 'Y' ? '활성' : '비활성'}
                  </td>
                  <td className='border px-4 py-2 text-center'>대기</td>
                  <td className='border px-4 py-2'>
                    {seller.companyInfo.companyName} (회사번호: {seller.companyInfo.companyNo})
                    <br />
                    라이센스: {seller.companyInfo.license} | 은행: {seller.companyInfo.bank} | 계좌:{' '}
                    {seller.companyInfo.bankAccount}
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
                <td colSpan='8' className='border px-4 py-2 text-center text-gray-500'>
                  승인 대기 판매자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Approved Sellers Search Area */}
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>| 승인 완료 판매자 목록 검색</h2>
        <div className='flex flex-col sm:flex-row sm:items-end gap-4'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-600 mb-1'>검색 기준</label>
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
            <label className='block text-sm font-medium text-gray-600 mb-1'>검색 입력</label>
            <input
              type='text'
              placeholder='검색어를 입력하세요'
              value={approvedSearchQuery}
              onChange={(e) => setApprovedSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApprovedSearch()
                }
              }}
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

      {/* Approved Sellers Table */}
      <div className='mb-8'>
        <table className='min-w-full border border-gray-300'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='border px-4 py-2'>판매자번호</th>
              <th className='border px-4 py-2'>판매자명</th>
              <th className='border px-4 py-2'>이메일</th>
              <th className='border px-4 py-2'>전화번호</th>
              <th className='border px-4 py-2'>계정상태</th>
              <th className='border px-4 py-2'>승인상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredApprovedSellers.length > 0 ? (
              filteredApprovedSellers.map((seller) => (
                <tr key={seller.sellerNo} className='hover:bg-gray-100'>
                  <td className='border px-4 py-2 text-center'>{seller.sellerNo}</td>
                  <td className='border px-4 py-2'>{seller.name}</td>
                  <td className='border px-4 py-2'>{seller.email}</td>
                  <td className='border px-4 py-2 text-center'>{seller.callNumber}</td>
                  <td className='border px-4 py-2 text-center'>
                    {seller.status === 'Y' ? '활성' : '비활성'}
                  </td>
                  <td className='border px-4 py-2 text-center'>승인</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='border px-4 py-2 text-center text-gray-500'>
                  승인 완료 판매자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerRegister
