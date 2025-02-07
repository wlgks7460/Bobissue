import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [hasPendingProduct, setHasPendingProduct] = useState(false)
  const [hasBusinessRegistrationCertificate, setHasBusinessRegistrationCertificate] =
    useState(false)

  useEffect(() => {
    const fetchPendingProduct = async () => {
      try {
        const response = await fetch('/products/pending')
        const data = await response.json()
        setHasPendingProduct(data.hasPending)
      } catch (error) {
        console.error('Error fetching pending product status:', error)
      }
    }

    // 🔹 사업자 등록증 상태 확인 (추후 API 연동 가능)
    const fetchBusinessRegistration = async () => {
      try {
        const response = await fetch('/api/business/status') // 예제 API 엔드포인트
        const data = await response.json()
        setHasBusinessRegistrationCertificate(data.isRegistered)
      } catch (error) {
        console.error('Error fetching business registration status:', error)
      }
    }

    fetchPendingProduct()
    fetchBusinessRegistration()
  }, [])

  return (
    <div className='w-[1100px] p-6 bg-blue-100'>
      <div className='flex flex-1'>
        {/* Main Content */}
        <div className='flex-1 p-6 bg-blue-100'>
          {/* 상단 카드 */}
          <div className='grid grid-cols-3 gap-6 mb-6'>
            <div className='bg-white p-6 rounded-lg border flex flex-col justify-between'>
              <h3 className='text-lg font-semibold'>상품 관리</h3>
              <p className='text-sm text-gray-600'>등록된 상품을 확인하고 관리하세요.</p>
              <Link to='products/search' className='mt-4'>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
                  상품 목록 보기
                </button>
              </Link>
            </div>
            <div className='bg-white p-6 rounded-lg border flex flex-col justify-between'>
              <h3 className='text-lg font-semibold'>주문 관리</h3>
              <p className='text-sm text-gray-600'>진행 중인 주문을 확인하세요.</p>
              <Link to='delivery/orders' className='mt-4'>
                <button className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'>
                  주문 목록 보기
                </button>
              </Link>
            </div>
            <div className='bg-white p-6 rounded-lg border flex flex-col justify-between'>
              <h3 className='text-lg font-semibold'>판매 통계</h3>
              <p className='text-sm text-gray-600'>판매 데이터를 확인하세요.</p>
              <Link to='stats/performance' className='mt-4'>
                <button className='bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600'>
                  통계 보기
                </button>
              </Link>
            </div>
          </div>

          {/* 상품 등록 및 이어서 등록 */}
          <div className='grid grid-cols-2 space-x-6'>
            <div className='bg-white p-5 rounded-lg flex  justify-between items-center mb-6 border'>
              {hasPendingProduct ? (
                <div>
                  <p className='text-lg font-semibold'>이어서 상품 등록하기</p>
                  <Link to='products/register'>
                    <button className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 mt-2'>
                      이어서 등록하기
                    </button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className='text-lg font-semibold'>새로운 상품을 등록하세요</p>
                  <Link to='products/register'>
                    <button className='bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 mt-2'>
                      상품 등록하기
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* 🔹 사업자 등록증 여부에 따른 버튼 표시 */}
            <div className='bg-white p-6 rounded-lg flex justify-between items-center mb-6 border'>
              {hasBusinessRegistrationCertificate ? (
                <div>
                  <p className='text-lg font-semibold'>라이브 커머스를 신청하세요</p>
                  <Link to='live/apply'>
                    <button className='bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 mt-2'>
                      라이브 신청하기
                    </button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className='text-lg font-semibold'>사업자 등록증을 먼저 등록하세요</p>
                  <Link to='business/register'>
                    <button className='bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 mt-2'>
                      사업자 등록하기
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className='grid grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-lg border'>
              <h3 className='text-lg font-semibold'>공지사항</h3>
              <p className='text-sm text-gray-600'>새로운 업데이트 및 판매자 공지를 확인하세요.</p>
              <Link to='notices' className='mt-4 block text-blue-500 hover:underline'>
                공지사항 보기
              </Link>
            </div>
            <div className='bg-white p-6 rounded-lg border'>
              <h3 className='text-lg font-semibold'>고객 문의</h3>
              <p className='text-sm text-gray-600'>고객의 질문과 요청을 확인하세요.</p>
              <Link to='inquiries/list' className='mt-4 block text-blue-500 hover:underline'>
                문의 확인하기
              </Link>
            </div>
            <div className='bg-white p-6 rounded-lg border'>
              <h3 className='text-lg font-semibold'>정산 관리</h3>
              <p className='text-sm text-gray-600'>정산 내역을 확인하고 관리하세요.</p>
              <Link to='settlement/overview' className='mt-4 block text-blue-500 hover:underline'>
                정산 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
