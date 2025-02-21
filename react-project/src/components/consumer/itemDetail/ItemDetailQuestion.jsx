import React, { useEffect, useState } from 'react'
import ItemDetailQuestionItem from './ItemDetailQuestionItem'
import { Link } from 'react-router-dom'
import API from '../../../utils/API'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

const ItemDetailQuestion = ({ itemNo }) => {
  // 문의 데이터
  const [questions, setQuestions] = useState([])

  const getQuestions = () => {
    API.get('/question')
      .then((res) => {
        const result = res.data.result.data.filter((v) => v.itemNo === itemNo)
        setQuestions(result)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 데이터 불러오기
  useEffect(() => {
    // mount
    getQuestions()
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <div>
        <div>
          <div className='flex justify-end mb-5'>
            <Link
              to={`/board/question?item=${itemNo}`}
              className='px-3 py-2 bg-[#A67B5B] hover:bg-[#6F4E37] rounded text-white'
            >
              문의하기
            </Link>
          </div>
          <table className='w-full table-fixed relative border-t-4 border-black'>
            <thead className='sticky'>
              <tr className='h-[50px] border-b-2 border-gray-500'>
                <th width='60%'>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>답변상태</th>
              </tr>
            </thead>
            <tbody>
              {questions.length > 0 ? (
                questions.map((v) => <ItemDetailQuestionItem key={v.questionNo} question={v} />)
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className='flex flex-col gap-3 items-center mt-10'>
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
      </div>
    </div>
  )
}

export default ItemDetailQuestion
