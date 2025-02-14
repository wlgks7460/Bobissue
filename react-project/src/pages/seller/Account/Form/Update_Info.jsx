import React, { useState } from 'react'

const UpdateInfo = ({ userInfo, onClose, onSave }) => {
  const [name, setName] = useState(userInfo.name)
  const [callNumber, setCallNumber] = useState(userInfo.callNumber)

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedInfo = {
      ...userInfo, // 기존 userInfo를 복사
      name: name,
      callNumber: callNumber,
    }
    onSave(updatedInfo) // 수정된 정보를 부모 컴포넌트로 전달
    onClose() // 수정 완료 후 Info 페이지로 돌아감
  }

  return (
    <div className=''>
      <h2 className='text-[28px] font-bold mb-6'>개인정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className='space-y-3 border border-gray-200 p-4 rounded-md'>
          <div className='flex justify-between'>
            <label className='font-medium text-gray-700 py-2'>이름</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-[400px] py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>

          <div className='flex justify-between'>
            <label className='font-medium text-gray-700 py-2'>전화번호</label>
            <input
              type='text'
              value={callNumber}
              onChange={(e) => setCallNumber(e.target.value)}
              className='w-[400px] py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>
        </div>

        {/* 수정하기 버튼 */}
        <div className='mt-4 flex justify-end'>
          <button type='submit' className='p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
            수정 완료
          </button>
        </div>
      </form>

      {/* 취소 버튼 */}
      <div className='flex justify-end mt-2'>
        <button
          type='button'
          onClick={onClose}
          className='p-2 bg-gray-300 text-black rounded-md hover:bg-gray-400'
        >
          취소
        </button>
      </div>
    </div>
  )
}

export default UpdateInfo
