import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '@/utils/API' // API 호출

const Report = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const inquiryId = queryParams.get('id') // ?id=문의번호
  const debug_mode = true // 디버그 모드 설정

  const [reasons, setReasons] = useState([]) // 기본 신고 사유 목록
  const [selectedReason, setSelectedReason] = useState('') // 선택된 신고 사유
  const [customReason, setCustomReason] = useState('') // 직접 입력 신고 사유
  const [showCustomInput, setShowCustomInput] = useState(false) // 직접 입력 필드 표시 여부

  // 기본 신고 사유 로딩
  useEffect(() => {
    if (debug_mode) {
      // 디버그 모드에서는 하드코딩된 신고 사유 사용
      setReasons(['부적절한 내용', '광고/스팸', '허위 정보', '욕설 및 비방', '기타'])
    } else {
      // 실제 API에서 신고 사유 목록 가져오기
      API.get('/questions/report/reasons')
        .then((response) => setReasons(response.data))
        .catch((error) => console.error('신고 사유 가져오기 실패:', error))
    }
  }, [debug_mode])

  // 신고 사유 변경 핸들러
  const handleReasonChange = (e) => {
    const value = e.target.value
    setSelectedReason(value)

    if (value === '기타') {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
      setCustomReason('') // 직접 입력 필드 초기화
    }
  }

  // 신고 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault()

    const finalReason = selectedReason === '기타' ? customReason : selectedReason

    if (!finalReason.trim()) {
      alert('신고 사유를 입력해주세요.')
      return
    }

    if (debug_mode) {
      console.log(`디버그 모드: 문의 ID(${inquiryId})가 신고되었습니다. 사유: ${finalReason}`)
      alert('디버그 모드: 신고 요청이 완료되었습니다.')
    } else {
      try {
        await API.post(`/questions/report/${inquiryId}`, { reason: finalReason })
        alert('신고가 정상적으로 접수되었습니다.')
      } catch (error) {
        console.error('신고 전송 실패:', error)
        alert('신고 요청을 보내는 데 실패했습니다.')
      }
    }

    // 신고 후 이전 페이지로 이동
    navigate(-1)
  }

  return (
    <div className='w-[500px] mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg'>
      <h1 className='text-xl font-semibold text-gray-800 border-b pb-3'>🚨 문의 신고</h1>

      <p className='text-sm text-gray-600 mt-2'>
        문의번호 <span className='font-semibold'>#{inquiryId}</span>에 대해 신고하시겠습니까? 신고
        사유를 선택해주세요.
      </p>

      <form onSubmit={handleSubmit} className='mt-4'>
        <label className='block text-gray-700 font-medium mb-2'>신고 사유</label>
        <select
          className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400'
          value={selectedReason}
          onChange={handleReasonChange}
        >
          <option value=''>신고 사유 선택</option>
          {reasons.map((reason, index) => (
            <option key={index} value={reason}>
              {reason}
            </option>
          ))}
        </select>

        {/* 기타 선택 시 직접 입력 가능 */}
        {showCustomInput && (
          <textarea
            className='w-full h-32 p-3 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400 resize-none'
            placeholder='신고 사유를 직접 입력하세요...'
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}

        <div className='flex justify-end space-x-2 mt-4'>
          <button
            type='button'
            className='px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            onClick={() => navigate(-1)}
          >
            ❌ 취소
          </button>
          <button
            type='submit'
            className='px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600'
          >
            🚨 신고 제출
          </button>
        </div>
      </form>
    </div>
  )
}

export default Report
