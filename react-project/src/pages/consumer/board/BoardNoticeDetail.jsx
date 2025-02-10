import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import API from '../../../utils/API'

const BoardNoticeDetail = () => {
  const params = useParams()

  const [notice, setNotice] = useState({})

  // 작성일 가공
  const handleCreateAt = (date) => {
    const result = date?.split(' ')[0].replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
    return result
  }

  const getNoticeDetail = () => {
    API.get(`/notification/${params.noticeNo}`)
      .then((res) => {
        setNotice(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    // mount
    getNoticeDetail()
  }, [])
  return (
    <div className='p-5'>
      <h2 className='text-2xl text-center mb-10'>공지사항</h2>
      <div>
        <h3 className='text-xl font-semibold'>{notice.title}</h3>
        <p className='text-sm text-gray-400'>{handleCreateAt(notice.createAt)}</p>
        <hr className='border-gray-300 my-3' />
        <div className='min-h-[300px]'>{notice.content}</div>
        <hr className='border-gray-300 my-3' />
        <div className='w-full text-center'>
          <Link to={'/board/notice'} className='text-green-900'>
            목록으로
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BoardNoticeDetail
