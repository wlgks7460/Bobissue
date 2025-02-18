import React, { useEffect, useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/solid'
import API from '../../../utils/API'

const ItemDetailQuestionItem = ({ question }) => {
  const [showContent, setShowContent] = useState(false)
  const [answer, setAnswer] = useState(null)

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
  const getAnswer = () => {
    API.get(`/question/${question.questionNo}/answer`)
      .then((res) => {
        setAnswer(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    if (question.status === 'Y' && showContent && !answer) {
      getAnswer()
    }
  }, [showContent])
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
          <td className='px-2'>{question.title}</td>
        )}
        <td className='text-center'>{handleCreateAt(question.createAt)}</td>
        <td className='text-center'>{question.status === 'N' ? '답변 대기' : '답변 완료'}</td>
      </tr>
      {showContent && (
        <tr className='border-b border-gray-400'>
          <td colSpan={3} className='p-3'>
            <div className='min-h-[150px]'>
              <p className='flex items-end gap-5 mb-10'>
                <span className='text-gray-400 text-lg'>Q.</span>
                <span>{question.content}</span>
              </p>
              {answer && (
                <p className='flex items-end gap-5'>
                  <span className='text-gray-400 text-lg'>A.</span>
                  <span>{answer?.content}</span>
                </p>
              )}
            </div>
            <p className='text-gray-400'>{handleCreateAt(question.updatedAt)}</p>
          </td>
        </tr>
      )}
    </>
  )
}

export default ItemDetailQuestionItem
