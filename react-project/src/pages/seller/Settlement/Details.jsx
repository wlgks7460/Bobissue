import React from 'react'
import SearchFilter from './Form/SearchFilter'
import API from '@/utils/API'

const Details = () => {
  const debug_mode = true // 디버그 모드 설정

  const handleSubmit = async (filters) => {
    console.log('검색 조건:', filters)

    if (!debug_mode) {
      try {
        const response = await API.get('/settlements', { params: filters })
        console.log('API 응답:', response.data)
      } catch (error) {
        console.error('API 요청 실패:', error)
      }
    }
  }

  return (
    <div>
      <SearchFilter onSearch={handleSubmit} />
    </div>
  )
}

export default Details
