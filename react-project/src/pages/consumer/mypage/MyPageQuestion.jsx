import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import { useSelector } from 'react-redux'
import ItemDetailQuestionItem from '../../../components/consumer/itemDetail/ItemDetailQuestionItem'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

const MyPageQuestion = () => {
  const userNo = useSelector((state) => state.user.userInfo.userNo)
  const [questions, setQuestions] = useState([])
  // 문의 리스트 조회
  const getUserQuestion = () => {
    API.get(`/users/${userNo}/questions`)
      .then((res) => {
        setQuestions(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    if (userNo) {
      getUserQuestion()
    }
  }, [userNo])
  return (
    <div className='p-5'>
      <h3 className='text-center text-xl mb-10'>내 문의 내역</h3>
      <table className='w-full table-fixed relative border-t-4 border-[#6F4E37]'>
        <thead className='sticky'>
          <tr className='h-[50px] border-b-2 border-gray-500'>
            <th width='60%'>제목</th>
            <th>작성일</th>
            <th>답변상태</th>
          </tr>
        </thead>
        <tbody>
          {questions.length > 0 ? (
            questions.map((v) => <ItemDetailQuestionItem key={v.questionNo} question={v} />)
          ) : (
            <tr>
              <td colSpan={'3'}>
                <div className='flex flex-col gap-3 items-center mt-20'>
                  <p className='text-center'>
                    <ExclamationCircleIcon className='w-20 text-gray-400' />
                  </p>
                  <p className='text-center text-xl text-gray-600'>문의가 없습니다.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default MyPageQuestion
