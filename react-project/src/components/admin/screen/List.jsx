import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'

const EventBannerListComponent = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '컨텐츠관리' },
    { name: '화면관리' },
    { name: '이벤트배너조회' },
  ]

  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await API.get('/event/banner')
        if (response.data.status === 'OK') {
          setBanners(response.data.result.data)
        } else {
          setError(response.data.message.label)
        }
      } catch (err) {
        setError('이벤트 배너 조회 중 오류 발생')
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  const handleEdit = (eventNo) => {
    window.location.href = `/event/banner/${eventNo}`
  }

  const handleDelete = async (eventNo) => {
    if (window.confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      try {
        await API.delete(`/event/banner/${eventNo}`)
        alert('배너가 삭제되었습니다.')
        setBanners((prev) => prev.filter((banner) => banner.eventNo !== eventNo))
      } catch (error) {
        alert('배너 삭제 실패: ' + error.message)
      }
    }
  }

  if (loading) {
    return <div className='text-center p-6'>로딩 중...</div>
  }

  if (error) {
    return <div className='text-center text-red-500 p-6'>{error}</div>
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>이벤트배너 조회</h1>

      <h2 className='text-lg font-semibold mb-4'>| 이벤트 배너 목록</h2>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>배너 제목</th>
            <th className='border px-4 py-2'>이미지</th>
            <th className='border px-4 py-2'>생성일</th>
            <th className='border px-4 py-2'>생성자</th>
            <th className='border px-4 py-2'>수정일</th>
            <th className='border px-4 py-2'>수정자</th>
            <th className='border px-4 py-2'>삭제 여부</th>
            <th className='border px-4 py-2'>액션</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.eventNo}>
              <td className='border px-4 py-2 text-center'>{banner.eventNo}</td>
              <td className='border px-4 py-2'>{banner.image.originalName}</td>
              <td className='border px-4 py-2 text-center'>
                <img
                  src={banner.image.imageUrl}
                  alt={banner.image.originalName}
                  className='w-16 h-16 object-cover mx-auto'
                />
              </td>
              <td className='border px-4 py-2 text-center'>{banner.image.createdAt}</td>
              <td className='border px-4 py-2 text-center'>{banner.image.createdUser}</td>
              <td className='border px-4 py-2 text-center'>{banner.image.updatedAt}</td>
              <td className='border px-4 py-2 text-center'>{banner.image.updatedUser}</td>
              <td className='border px-4 py-2 text-center'>{banner.image.delYn}</td>
              <td className='border px-4 py-2 text-center'>
                <button
                  className='mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'
                  onClick={() => handleEdit(banner.eventNo)}
                >
                  수정
                </button>
                <button
                  className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                  onClick={() => handleDelete(banner.eventNo)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EventBannerListComponent
