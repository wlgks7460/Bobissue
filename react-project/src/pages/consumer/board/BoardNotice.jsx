import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import { Link } from 'react-router-dom'

const BoardNotice = () => {
  const [notice, setNotice] = useState([])

  // 작성일 가공
  const handleCreateAt = (date) => {
    const result = date.split(' ')[0].replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
    return result
  }

  // 공지사항 불러오기
  const getNotice = () => {
    API.get('/notification/user-only')
      .then((res) => {
        setNotice(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    // mount
    getNotice()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='p-5'>
      <h2 className='text-2xl text-center mb-10'>공지사항</h2>
      <div>
        <table className='w-full table-fixed relative border-t-4 border-black'>
          <thead className='sticky'>
            <tr className='h-[50px] border-b-2 border-gray-500'>
              <th width='80%'>제목</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {notice.length > 0 ? (
              notice.map((v) => (
                <tr key={v.noticeNo} className='h-[45px] border-b border-gray-400'>
                  <td className='px-3'>
                    <Link to={`/board/notice/${v.noticeNo}`}>{v.title}</Link>
                  </td>
                  <td className='text-center'>{handleCreateAt(v.createAt)}</td>
                </tr>
              ))
            ) : (
              <tr className='h-[35px] border-b border-gray-400'>
                <td colSpan={'2'}>문의가 없습니다 ㅠㅠ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BoardNotice
