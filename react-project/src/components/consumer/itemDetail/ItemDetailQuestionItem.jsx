import React, { useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/solid'

const ItemDetailQuestionItem = ({ question }) => {
  const [showContent, setShowContent] = useState(false)
  const userName = '김지원'
  // 이용자 이름 * 변경
  const handleUserName = (userName) => {
    const result = userName
      .split('')
      .map((v, index) => (v = index !== 0 ? '*' : v))
      .join('')
    return result
  }
  // 작성일 가공
  const handleCreateAt = (date) => {
    const result = date.split(' ')[0].replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
    return result
  }
  // 내용 및 답변 확인
  const handleContent = () => {
    if (question.isPrivate === 'N') {
      setShowContent(!showContent)
    } else {
      alert('비밀글입니다.')
    }
  }
  return (
    <>
      <tr className='h-[45px] border-b border-gray-400 cursor-pointer' onClick={handleContent}>
        {question.isPrivate === 'Y' ? (
          <td className='text-gray-400'>
            <span className='flex'>
              비밀글입니다.
              <LockClosedIcon className='w-5 ms-1' />
            </span>
          </td>
        ) : (
          <td>{question.title}</td>
        )}
        <td className='text-center'>{handleUserName(userName)}</td>
        <td className='text-center'>{handleCreateAt(question.createAt)}</td>
        <td className='text-center'>{question.status === 'N' ? '답변 대기' : '답변 완료'}</td>
      </tr>
      {showContent && (
        <tr className='border-b border-gray-400'>
          <td colSpan={4} className='p-3'>
            <p className='min-h-[150px]'>{question.content}</p>
            <p className='text-gray-400'>{handleCreateAt(question.updatedAt)}</p>
          </td>
        </tr>
      )}
    </>
  )
}

export default ItemDetailQuestionItem
