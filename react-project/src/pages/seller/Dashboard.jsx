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

    const fetchBusinessRegistration = async () => {
      try {
        const response = await fetch('/business/status')
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
    <div className=' mx-auto p-6 bg-blue-100 min-h-screen'>
      <div className='flex flex-wrap'>
        {/* Main Content */}
        <div className='flex-1 p-6 bg-blue-100'>
          {/* 상단 카드 */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6'>
            {[
              {
                title: '상품 관리',
                description: '등록된 상품을 확인하고 관리하세요.',
                link: 'products/search',
                buttonText: '상품 목록 보기',
                color: 'bg-blue-500 hover:bg-blue-600',
              },
              {
                title: '주문 관리',
                description: '진행 중인 주문을 확인하세요.',
                link: 'delivery/orders',
                buttonText: '주문 목록 보기',
                color: 'bg-green-500 hover:bg-green-600',
              },
              {
                title: '판매 통계',
                description: '판매 데이터를 확인하세요.',
                link: 'stats/performance',
                buttonText: '통계 보기',
                color: 'bg-purple-500 hover:bg-purple-600',
              },
            ].map((item, index) => (
              <div
                key={index}
                className='bg-white p-6 rounded-lg border flex flex-col justify-between min-w-[250px]'
              >
                <h3 className='text-lg font-semibold'>{item.title}</h3>
                <p className='text-sm text-gray-600'>{item.description}</p>
                <Link to={item.link} className='mt-4'>
                  <button className={`${item.color} text-white px-4 py-2 rounded-md`}>
                    {item.buttonText}
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* 상품 등록 및 이어서 등록 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white p-5 rounded-lg flex flex-col justify-between items-start mb-6 border min-w-[300px]'>
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

            <div className='bg-white p-6 rounded-lg flex flex-col justify-between items-start mb-6 border min-w-[300px]'>
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
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {[
              {
                title: '공지사항',
                description: '새로운 업데이트 및 판매자 공지를 확인하세요.',
                link: 'notices',
              },
              {
                title: '고객 문의',
                description: '고객의 질문과 요청을 확인하세요.',
                link: 'inquiries/list',
              },
              {
                title: '정산 관리',
                description: '정산 내역을 확인하고 관리하세요.',
                link: 'settlement/overview',
              },
            ].map((item, index) => (
              <div key={index} className='bg-white p-6 rounded-lg border min-w-[250px]'>
                <h3 className='text-lg font-semibold'>{item.title}</h3>
                <p className='text-sm text-gray-600'>{item.description}</p>
                <Link to={item.link} className='mt-4 block text-blue-500 hover:underline'>
                  {item.title} 보기
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
