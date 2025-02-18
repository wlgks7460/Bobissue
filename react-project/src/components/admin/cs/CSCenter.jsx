import React, { useState, useEffect } from 'react'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'

const CSCenter = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: 'CS관리' }, { name: '문의현황' }]

  const [inquiries, setInquiries] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchField, setSearchField] = useState('title')

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await API.get('/question')
        console.log('문의 목록 API 응답:', response.data)

        if (response.data?.result?.data) {
          setInquiries(response.data.result.data)
        } else {
          console.error('문의 목록 데이터가 없음:', response.data)
          setInquiries([])
        }
      } catch (error) {
        console.error('문의 목록을 가져오는 중 오류 발생:', error)
        setInquiries([])
      }
    }

    fetchInquiries()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return `${dateString.substring(0, 4)}년 ${dateString.substring(4, 6)}월 ${dateString.substring(6, 8)}일`
  }

  const handleSearch = () => {
    const filtered = inquiries.filter((inquiry) => {
      const value =
        searchField === 'title'
          ? inquiry.title
          : searchField === 'userNo'
            ? String(inquiry.userNo)
            : inquiry.category
      return value === searchKeyword
    })
    setInquiries(filtered)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>문의현황</h2>

      {/* 검색 섹션 */}
      <div className='mb-6'>
        <div className='flex space-x-4'>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value='title'>제목</option>
            <option value='userNo'>회원번호</option>
            <option value='category'>카테고리</option>
          </select>

          <input
            type='text'
            placeholder='검색어를 입력하세요'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className='border p-2 rounded w-64'
          />

          <button
            onClick={handleSearch}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            조회
          </button>
        </div>
      </div>

      <section className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>| 전체 문의 목록</h3>
        </div>

        <table className='w-full border-collapse border'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='border p-2 text-left text-sm font-medium text-gray-600'>번호</th>
              <th className='border p-2 text-left text-sm font-medium text-gray-600'>회원번호</th>
              <th className='border p-2 text-left text-sm font-medium text-gray-600'>제목</th>
              <th className='border p-2 text-left text-sm font-medium text-gray-600'>카테고리</th>
              <th className='border p-2 text-left text-sm font-medium text-gray-600'>문의 날짜</th>
              <th className='border p-2 text-left text-sm font-medium text-gray-600'>상태</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <tr key={inquiry.questionNo} className='hover:bg-gray-50'>
                  <td className='border p-2 text-sm text-gray-700'>{inquiry.questionNo}</td>
                  <td className='border p-2 text-sm text-gray-700'>{inquiry.userNo}</td>
                  <td className='border p-2 text-sm text-gray-700'>{inquiry.title}</td>
                  <td className='border p-2 text-sm text-gray-700'>{inquiry.category}</td>
                  <td className='border p-2 text-sm text-gray-700'>
                    {formatDate(inquiry.createAt)}
                  </td>
                  <td className='border p-2 text-sm text-gray-700'>
                    {inquiry.status === 'Y' ? '응답 완료' : '미응답'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='border p-4 text-center text-gray-500'>
                  문의 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default CSCenter
