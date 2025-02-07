import React, { useState, useEffect } from 'react'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'

const CSCenter = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: 'CS관리' }, { name: '문의현황' }]

  // 검색 관련 상태
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchField, setSearchField] = useState('title')
  const [searchDate, setSearchDate] = useState('')

  // 문의 목록 관련 상태
  const [inquiries, setInquiries] = useState([])
  const [filteredInquiries, setFilteredInquiries] = useState([])
  const [selectedInquiry, setSelectedInquiry] = useState(null)

  // 답변 관련 상태
  const [replyText, setReplyText] = useState('')
  const [replyingInquiryId, setReplyingInquiryId] = useState(null)

  // 초기 문의 목록을 가져오는 함수
  // 컴포넌트 마운트 시 실행, 미응답 (status='N') 문의만 필터링하여 표시
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await API.get('/question')
        console.log('문의 목록 API 응답:', response.data)

        if (response.data?.result?.data) {
          // 미응답 문의만 필터링
          const unansweredInquiries = response.data.result.data.filter(
            (inquiry) => inquiry.status === 'N',
          )
          setInquiries(unansweredInquiries)
          setFilteredInquiries(unansweredInquiries)
        } else {
          console.error('문의 목록 데이터가 없음:', response.data)
          setInquiries([])
          setFilteredInquiries([])
        }
      } catch (error) {
        console.error('문의 목록을 가져오는 중 오류 발생:', error)
        setInquiries([])
        setFilteredInquiries([])
      }
    }

    fetchInquiries()
  }, [])
  // 검색 실행 함수
  // 검색어, 검색 필드, 날짜에 따라 문의 목록을 필터링
  // 답변 모드에서는 검색 비활성화화
  const handleSearch = () => {
    // 답변 중인 상태라면 검색하지 않음
    if (replyingInquiryId) return

    const filtered = inquiries.filter((inquiry) => {
      // 검색 필드에 따른 필터링 로직
      const matchesField =
        searchField === 'title'
          ? inquiry.title.toLowerCase().includes(searchKeyword.toLowerCase())
          : searchField === 'userNo'
            ? String(inquiry.userNo).includes(searchKeyword)
            : inquiry.category.toLowerCase().includes(searchKeyword.toLowerCase())
      // 날짜 필터링 로직
      const matchesDate = searchDate
        ? inquiry.createAt.startsWith(searchDate.replaceAll('-', ''))
        : true

      return matchesField && matchesDate
    })

    setFilteredInquiries(filtered)
  }
  // 날짜 형식 변환 함수
  // YYYYMMDD 형식 -> YYYY년 MM월 DD일 형식으로 변환
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return `${dateString.substring(0, 4)}년 ${dateString.substring(4, 6)}월 ${dateString.substring(6, 8)}일`
  }

  // 답변 모드 토글 함수
  // 답변 버튼 클릭 시 해당 문의만 표시
  // 이미 선택된 문의를 다시 클릭하면 전체 목록으로 복귀
  const handleReplyToggle = (questionNo) => {
    if (replyingInquiryId === questionNo) {
      // 같은 문의를 다시 클릭하면 전체 목록으로 돌아감
      setReplyingInquiryId(null)
      setFilteredInquiries(inquiries)
    } else {
      // 새로운 문의 선택 시 해당 문의만 표시
      setReplyingInquiryId(questionNo)
      const selectedInquiry = inquiries.find((inquiry) => inquiry.questionNo === questionNo)
      setFilteredInquiries(selectedInquiry ? [selectedInquiry] : [])
    }
    setReplyText('')
  }

  const handleReplySubmit = async (questionNo) => {
    if (!replyText.trim()) {
      alert('답변 내용을 입력하세요.')
      return
    }

    try {
      // 답변 저장 API 호출 -> 추후에 확인 후 API 주소 변경 필요
      await API.post('/question/reply', {
        questionNo,
        content: replyText,
      })

      alert('답변이 저장되었습니다!')

      // 답변 완료된 문의 제거
      const updatedInquiries = inquiries.filter((inquiry) => inquiry.questionNo !== questionNo)
      setInquiries(updatedInquiries)
      setFilteredInquiries(updatedInquiries)
      setReplyingInquiryId(null)
      setReplyText('')
    } catch (error) {
      console.error('답변 저장 중 오류 발생:', error)
      alert('답변 저장에 실패했습니다.')
    }
  }

  // 전체 목록으로 돌아가기
  const handleReset = () => {
    setReplyingInquiryId(null)
    setFilteredInquiries(inquiries)
    setReplyText('')
    setSearchKeyword('')
    setSearchDate('')
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>고객센터 관리</h2>

      {/* 검색 섹션 */}
      {!replyingInquiryId && (
        <section className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>| 문의 검색</h3>
          <div className='flex items-center mb-4 space-x-4'>
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
              className='flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            />

            <input
              type='date'
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            />

            <button
              onClick={handleSearch}
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
            >
              검색
            </button>
          </div>
        </section>
      )}

      {/* 문의 목록 */}
      <section className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>
            | {replyingInquiryId ? '답변 작성' : '미응답 문의 목록'}
          </h3>
          {replyingInquiryId && (
            <button
              onClick={handleReset}
              className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
            >
              전체 목록
            </button>
          )}
        </div>

        <table className='w-full border-collapse border'>
          <thead>
            <tr>
              <th className='border p-2'>번호</th>
              <th className='border p-2'>회원번호</th>
              <th className='border p-2'>제목</th>
              <th className='border p-2'>카테고리</th>
              <th className='border p-2'>문의 날짜</th>
              <th className='border p-2'>답변</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry) => (
                <tr key={inquiry.questionNo}>
                  <td className='border p-2'>{inquiry.questionNo}</td>
                  <td className='border p-2'>{inquiry.userNo}</td>
                  <td className='border p-2'>{inquiry.title}</td>
                  <td className='border p-2'>{inquiry.category}</td>
                  <td className='border p-2'>{formatDate(inquiry.createAt)}</td>
                  <td className='border p-2 text-center'>
                    <button
                      onClick={() => handleReplyToggle(inquiry.questionNo)}
                      className={`${
                        replyingInquiryId === inquiry.questionNo
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white px-4 py-2 rounded-md`}
                    >
                      {replyingInquiryId === inquiry.questionNo ? '취소' : '답변'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='border p-4 text-center'>
                  미응답 문의가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* 답변 입력란 */}
      {replyingInquiryId && (
        <div className='mt-4 p-4 border rounded'>
          <textarea
            className='w-full border p-2 rounded mb-2'
            rows='4'
            placeholder='답변을 입력하세요'
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className='flex justify-end space-x-2'>
            <button
              onClick={() => handleReplySubmit(replyingInquiryId)}
              className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
            >
              답변 제출
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CSCenter
