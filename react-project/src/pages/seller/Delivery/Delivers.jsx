import React, { useState, useEffect } from 'react'
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'
import API from '../../../utils/API'

const Delivers = () => {
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deliverList, setDeliverList] = useState([])
  const [filteredDelivers, setFilteredDelivers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const deliversPerPage = 10
  const pagesPerGroup = 5
  const debugMode = localStorage.getItem('debug_mode') === 'true'

  const dummyDelivers = [
    { id: 'D001', product: '무선 충전기', status: 'preparing', details: '고속 충전 지원 / 무선 범위 10m' },
    { id: 'D002', product: '게이밍 키보드', status: 'shipping', details: 'RGB 백라이트 / 기계식 스위치' },
    { id: 'D003', product: '노트북 거치대', status: 'delivered', details: '알루미늄 재질 / 각도 조절 가능' },
    { id: 'D004', product: '무선 마우스', status: 'confirmed', details: '초고속 응답속도 / 인체공학 디자인' },
  ]

  useEffect(() => {
    if (debugMode) {
      setDeliverList(dummyDelivers)
      return
    }

    const fetchDelivers = async () => {
      setIsLoading(true)
      try {
        const response = await API.get('/delivers')
        if (response.data.status === 'OK') {
          setDeliverList(response.data.result.data)
        } else {
          throw new Error(response.data.message.label)
        }
      } catch (err) {
        setError('배송 목록을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDelivers()
  }, [])

  useEffect(() => {
    const filtered =
      selectedTab === 'all' ? deliverList : deliverList.filter((deliver) => deliver.status === selectedTab)
    setFilteredDelivers(filtered)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }, [selectedTab, deliverList])

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredDelivers.length / deliversPerPage)
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages)
  const displayedDelivers = filteredDelivers.slice((currentPage - 1) * deliversPerPage, currentPage * deliversPerPage)

  const handleOpenPopup = (product) => {
    setSelectedProduct(product)
  }

  const handleClosePopup = () => {
    setSelectedProduct(null)
  }

  return (
    <div className='min-h-screen bg-white py-10 px-5 sm:px-10'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-gray-900'>배송 관리</h1>
          <p className='mt-2 text-lg text-gray-700'>배송 상태에 따라 상품을 관리하세요.</p>
        </div>

        <div className='flex justify-center gap-3 mb-6'>
          {['all', 'preparing', 'shipping', 'delivered', 'confirmed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedTab(status)}
              className={`px-5 py-2 rounded-md text-lg font-medium transition duration-300 ${
                selectedTab === status
                  ? 'bg-gray-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-400 hover:text-white'
              }`}
            >
              {status === 'all' ? '전체' : status}
            </button>
          ))}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {displayedDelivers.length === 0 ? (
            <div className='col-span-3 text-center text-gray-500 text-lg'>
              해당 분류의 배송이 없습니다.
            </div>
          ) : (
            displayedDelivers.map((deliver) => (
              <div
                key={deliver.id}
                className='bg-white p-5 rounded-lg shadow border border-gray-300 hover:scale-105 transition duration-200 cursor-pointer'
                onClick={() => handleOpenPopup(deliver)}
              >
                <h3 className='text-lg font-semibold text-gray-900'>{deliver.product}</h3>
                <p className='text-gray-700 mt-1 font-medium'>상태: {deliver.status}</p>
                <div className='mt-3 text-sm text-gray-600'>{deliver.details}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center mt-8'>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleLeft />
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-4 py-2 rounded-md text-lg font-medium transition ${
                currentPage === page ? 'bg-gray-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-400 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleRight />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      )}
    </div>
  )
}

export default Delivers
