import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const FAQ = () => {
  // Breadcrumb 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: 'CS관리' }, { name: 'FAQ운영' }]

  // 상태 관리
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      target: '판매자',
      question: '판매를 시작하려면 어떻게 하나요?',
      answer: '판매 등록은 관리자 승인이 필요합니다. 관리자에게 신청서를 제출하세요.',
      date: '2025-01-25',
    },
    {
      id: 2,
      target: '이용자',
      question: '회원가입은 어떻게 하나요?',
      answer:
        '회원가입은 이메일 인증을 통해 가능합니다. 가입 버튼을 클릭 후 이메일 인증을 완료하세요.',
      date: '2025-01-24',
    },
    {
      id: 3,
      target: '판매자',
      question: '상품 등록은 어디에서 하나요?',
      answer: '판매자 페이지에서 상품 등록 메뉴를 이용하세요.',
      date: '2025-01-23',
    },
    {
      id: 4,
      target: '이용자',
      question: '구매 내역은 어디에서 확인하나요?',
      answer: '마이페이지 > 구매 내역에서 확인 가능합니다.',
      date: '2025-01-22',
    },
  ]) // 초기 예시 데이터

  const [filteredTarget, setFilteredTarget] = useState('전체') // 필터링 대상
  const [newFAQ, setNewFAQ] = useState({ target: '판매자', question: '', answer: '' })
  const [editingFAQ, setEditingFAQ] = useState(null) // 수정 중인 FAQ

  // FAQ 필터링
  const filteredFAQs =
    filteredTarget === '전체' ? faqs : faqs.filter((faq) => faq.target === filteredTarget)

  // FAQ 작성 핸들러
  const handleCreateFAQ = () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      alert('질문과 답변을 입력하세요.')
      return
    }

    setFaqs((prev) => [
      ...prev,
      { id: Date.now(), ...newFAQ, date: new Date().toISOString().split('T')[0] },
    ])
    setNewFAQ({ target: '판매자', question: '', answer: '' })
  }

  // FAQ 수정 핸들러
  const handleEditFAQ = () => {
    if (!editingFAQ.question.trim() || !editingFAQ.answer.trim()) {
      alert('질문과 답변을 입력하세요.')
      return
    }

    setFaqs((prev) => prev.map((faq) => (faq.id === editingFAQ.id ? editingFAQ : faq)))
    setEditingFAQ(null)
  }

  // FAQ 삭제 핸들러
  const handleDeleteFAQ = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setFaqs((prev) => prev.filter((faq) => faq.id !== id))
    }
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />

      <h2 className='text-2xl font-bold mb-6'>FAQ 운영</h2>

      {/* FAQ 필터링 */}
      <section className='mb-6'>
        <label className='block text-sm font-medium mb-2'>FAQ 대상을 선택하세요</label>
        <select
          value={filteredTarget}
          onChange={(e) => setFilteredTarget(e.target.value)}
          className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
        >
          <option value='전체'>전체</option>
          <option value='판매자'>판매자</option>
          <option value='이용자'>이용자</option>
        </select>
      </section>

      {/* FAQ 목록 */}
      <section className='mb-6'>
        <h3 className='text-lg font-semibold mb-4'>| FAQ 목록</h3>
        <table className='w-full border-collapse border'>
          <thead>
            <tr>
              <th className='border p-2'>번호</th>
              <th className='border p-2'>대상</th>
              <th className='border p-2'>질문</th>
              <th className='border p-2'>답변</th>
              <th className='border p-2'>날짜</th>
              <th className='border p-2'>수정</th>
              <th className='border p-2'>삭제</th>
            </tr>
          </thead>
          <tbody>
            {filteredFAQs.map((faq) => (
              <tr key={faq.id}>
                <td className='border p-2'>{faq.id}</td>
                <td className='border p-2'>{faq.target}</td>
                <td className='border p-2'>{faq.question}</td>
                <td className='border p-2'>{faq.answer}</td>
                <td className='border p-2'>{faq.date}</td>
                <td className='border p-2 text-center'>
                  <button
                    onClick={() => setEditingFAQ(faq)}
                    className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
                  >
                    수정
                  </button>
                </td>
                <td className='border p-2 text-center'>
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FAQ 작성 */}
      {!editingFAQ && (
        <section className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>| 신규 FAQ 등록</h3>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>FAQ 대상</label>
            <select
              value={newFAQ.target}
              onChange={(e) => setNewFAQ((prev) => ({ ...prev, target: e.target.value }))}
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value='판매자'>판매자</option>
              <option value='이용자'>이용자</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>질문</label>
            <input
              type='text'
              value={newFAQ.question}
              onChange={(e) => setNewFAQ((prev) => ({ ...prev, question: e.target.value }))}
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>답변</label>
            <textarea
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ((prev) => ({ ...prev, answer: e.target.value }))}
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <button
            onClick={handleCreateFAQ}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            FAQ 작성
          </button>
        </section>
      )}

      {/* FAQ 수정 */}
      {editingFAQ && (
        <section className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>| FAQ 수정</h3>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>FAQ 대상</label>
            <select
              value={editingFAQ.target}
              onChange={(e) => setEditingFAQ((prev) => ({ ...prev, target: e.target.value }))}
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value='판매자'>판매자</option>
              <option value='이용자'>이용자</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>질문</label>
            <input
              type='text'
              value={editingFAQ.question}
              onChange={(e) => setEditingFAQ((prev) => ({ ...prev, question: e.target.value }))}
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>답변</label>
            <textarea
              value={editingFAQ.answer}
              onChange={(e) => setEditingFAQ((prev) => ({ ...prev, answer: e.target.value }))}
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <button
            onClick={handleEditFAQ}
            className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
          >
            FAQ 수정
          </button>
          <button
            onClick={() => setEditingFAQ(null)}
            className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-4'
          >
            취소
          </button>
        </section>
      )}
    </div>
  )
}

export default FAQ
