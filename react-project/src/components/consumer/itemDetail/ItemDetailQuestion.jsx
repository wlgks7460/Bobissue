import React, { useEffect, useState } from 'react'
import ItemDetailQuestionItem from './ItemDetailQuestionItem'
import { Link } from 'react-router-dom'
import API from '../../../utils/API'

const ItemDetailQuestion = () => {
  // 문의 데이터
  const [questions, setQuestions] = useState([])

  // 데이터 불러오기
  useEffect(() => {
    // mount
    const res = {
      data: {
        result: {
          data: [
            {
              category: '배송',
              content: 'test2',
              createAt: '20250125 101437',
              createdUser: 0,
              delYN: 'N',
              isPrivate: 'N',
              itemNo: 3,
              questionNo: 1,
              status: 'N',
              title: '개발을 빨리 끝내고 싶어!!!!',
              updatedAt: '20250125 101437',
              updatedUser: 0,
              userNo: 0,
            },
            {
              category: '배송',
              content: 'test2',
              createAt: '20250125 101437',
              createdUser: 0,
              delYN: 'N',
              isPrivate: 'N',
              itemNo: 3,
              questionNo: 2,
              status: 'Y',
              title: '개발을 빨리 끝내고 싶어!!!!',
              updatedAt: '20250125 101437',
              updatedUser: 0,
              userNo: 0,
            },
            {
              category: '배송',
              content: 'test2',
              createAt: '20250125 101437',
              createdUser: 0,
              delYN: 'N',
              isPrivate: 'Y',
              itemNo: 3,
              questionNo: 3,
              status: 'N',
              title: '개발을 빨리 끝내고 싶어!!!!',
              updatedAt: '20250125 101437',
              updatedUser: 0,
              userNo: 0,
            },
          ],
        },
      },
    }
    setQuestions(res.data.result.data)
    // API.get('/question')
    //   .then((res) => {
    //     console.log(res)
    //   })
    //   .catch((err) => {
    //     console.error(err)
    //   })
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <div>
        <div>
          <div className='flex justify-end mb-5'>
            <Link className='p-3 bg-indigo-400 hover:bg-indigo-600 rounded text-white'>
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
                <tr className='h-[35px] border-b border-gray-400'>
                  <td colSpan={'4'}>문의가 없습니다 ㅠㅠ</td>
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
