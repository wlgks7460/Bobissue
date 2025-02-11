import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const SellerRegister = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자관리' }, { name: '판매승인' }]

  const [approvals, setApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('companyNo')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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

  const processCompanies = (status) => {
    return approvals
      .filter((company) =>
        status === 'pending'
          ? company.statistics.pendingCount > 0
          : company.statistics.approvedCount > 0,
      )
      .map((company) => {
        const sortedSellers = company.sellers.sort((a, b) => a.sellerNo - b.sellerNo)
        const representativeSeller = sortedSellers.find(
          (seller) => seller.approvalStatus === (status === 'pending' ? 'N' : 'Y'),
        )
        return {
          ...company,
          representativeSeller,
        }
      })
  }

  const pendingCompanies = processCompanies('pending')
  const approvedCompanies = processCompanies('approved')

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = pendingCompanies.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(pendingCompanies.length / itemsPerPage)

  const filteredApprovedCompanies = approvedCompanies.filter((company) => {
    if (!appliedSearchQuery) return true
    const fieldValue = String(company[searchType] || '')
      .trim()
      .toLowerCase()
    return fieldValue === appliedSearchQuery.trim().toLowerCase()
  })

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
  const handleSearch = () => {
    console.log('🔍 검색 실행:', searchType, searchQuery)
    setAppliedSearchQuery(searchQuery)
  }
  return (
    <div className='p-6 bg-white min-h-screen'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매권한 승인</h1>

      {/* 승인 대기 목록 */}
      <div className='mb-8'>
        <h2 className='text-lg font-semibold mb-4'>| 승인 대기 회사 목록</h2>
        <table className='min-w-full border border-gray-300'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='border px-4 py-2'>회사번호</th>
              <th className='border px-4 py-2'>회사명</th>
              <th className='border px-4 py-2'>대표 이메일</th>
              <th className='border px-4 py-2'>대표 전화번호</th>
              <th className='border px-4 py-2'>회사정보</th>
              <th className='border px-4 py-2'>승인</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((company) => (
                <tr key={company.companyNo} className='hover:bg-gray-100'>
                  <td className='border px-4 py-2 text-center'>{company.companyNo}</td>
                  <td className='border px-4 py-2 text-center'>{company.companyName}</td>
                  <td className='border px-4 py-2 text-center'>
                    {company.representativeSeller?.email || '-'}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {company.representativeSeller?.callNumber || '-'}
                  </td>
                  <td className='border px-4 py-2'>
                    <div className='text-sm'>
                      <strong>사업자등록번호</strong>: {company.license}
                      <br />
                      <strong>은행</strong>: {company.bank} | 계좌: {company.bankAccount}
                    </div>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() =>
                        handleApproveSeller(
                          company.companyNo,
                          company.representativeSeller?.sellerNo,
                        )
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
                  승인 대기 중인 회사가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 승인 완료 목록 */}
      <div className='mb-8'>
        <h2 className='mb-4 text-lg font-semibold'>| 승인 완료 회사 목록</h2>
        {/* ✅ 검색 필터 */}
        <div className='mb-4'>
          <div className='flex flex-col sm:flex-row sm:items-end gap-4'>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className='w-100 border rounded-md px-3 py-2'
            >
              <option value='companyNo'>회사번호</option>
              <option value='companyName'>회사명</option>
              <option value='representativeEmail'>대표 이메일</option>
              <option value='representativePhone'>대표 전화번호</option>
            </select>
            <input
              type='text'
              placeholder='검색어 입력'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className='w-150 border rounded-md px-3 py-2'
            />
            <button
              onClick={handleSearch}
              className='bg-blue-500 text-white text-sm px-4 py-3 w-24 rounded-md hover:bg-blue-600'
            >
              조회
            </button>
          </div>
        </div>
        <table className='min-w-full border border-gray-300'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='border px-4 py-2'>회사번호</th>
              <th className='border px-4 py-2'>회사명</th>
              <th className='border px-4 py-2'>대표 이메일</th>
              <th className='border px-4 py-2'>대표 전화번호</th>
              <th className='border px-4 py-2'>회사정보</th>
            </tr>
          </thead>
          <tbody>
            {filteredApprovedCompanies.length > 0 ? (
              filteredApprovedCompanies.map((company) => (
                <tr key={company.companyNo} className='hover:bg-gray-100'>
                  <td className='border px-4 py-2 text-center'>{company.companyNo}</td>
                  <td className='border px-4 py-2 text-center'>{company.companyName}</td>
                  <td className='border px-4 py-2 text-center'>
                    {company.representativeSeller?.email || '-'}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {company.representativeSeller?.callNumber || '-'}
                  </td>
                  <td className='border px-4 py-2'>
                    <div className='text-sm'>
                      <strong>사업자등록번호</strong>: {company.license}
                      <br />
                      <strong>은행</strong>: {company.bank} | 계좌: {company.bankAccount}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='border px-4 py-2 text-center text-gray-500'>
                  해당 회사가 목록에 존재하지 않습니다.
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
