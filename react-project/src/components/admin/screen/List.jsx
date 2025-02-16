import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'

const EventBannerListComponent = () => {
  // Breadcrumb 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '컨텐츠관리' },
    { name: '화면관리' },
    { name: '이벤트배너조회' },
  ]

  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // API 호출
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
        setError('배너 데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  if (loading) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h2 className='text-2xl font-bold mb-6'>이벤트 배너 조회</h2>
        <div className='text-center text-gray-500'>로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h2 className='text-2xl font-bold mb-6'>이벤트 배너 조회</h2>
        <div className='text-center text-red-500'>{error}</div>
      </div>
    )
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
            <th className='border px-4 py-2'>이미지 이름</th>
            <th className='border px-4 py-2'>이미지 URL</th>
            <th className='border px-4 py-2'>이미지</th>
            <th className='border px-4 py-2'>생성일</th>
            <th className='border px-4 py-2'>생성자</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.eventNo}>
              <td className='border px-4 py-2 text-center'>{banner.eventNo}</td>
              <td className='border px-4 py-2'>{banner.image.originalName}</td>
              <td className='border px-4 py-2 text-center'>
                <a
                  href={banner.image.imageUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  {banner.image.imageUrl}
                </a>
              </td>
              <td className='border px-4 py-2 text-center'>
                <img
                  src={banner.image.imageUrl}
                  alt={banner.image.originalName}
                  className='w-16 h-16 object-cover mx-auto rounded'
                />
              </td>
              <td className='border px-4 py-2 text-center'>{banner.image.createdAt}</td>
              <td className='border px-4 py-2 text-center'>{banner.image.createdUser}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EventBannerListComponent
