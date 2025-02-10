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
    <div className='mx-auto p-6 bg-blue-100 min-h-screen'>
      <div className='flex flex-wrap'>
        {/* Main Content */}
        <div className='flex-1 p-6 bg-blue-100'>
          {/* 상단 카드 */}
          <div className='flex flex-row gap-6 mb-6'>
            <div className='bg-white p-6 rounded-lg border flex flex-col justify-between min-w-[250px]'>
              <h3 className='text-lg font-semibold'>상품 관리</h3>
              <p className='text-sm text-gray-600'>등록된 상품을 확인하고 관리하세요.</p>
              <Link to='products/search' className='mt-4'>
                <button className='bg-indigo-500 text-white px-4 py-2 rounded-full text-sm inline-flex items-center hover:bg-indigo-700 transition-colors'>
                  상품 목록 보기
                </button>
              </Link>
            </div>

            <div className='bg-white p-6 rounded-lg border flex flex-col justify-between min-w-[250px]'>
              <h3 className='text-lg font-semibold'>주문 관리</h3>
              <p className='text-sm text-gray-600'>진행 중인 주문을 확인하세요.</p>
              <Link to='delivery/orders' className='mt-4'>
                <button className='bg-green-500 text-white px-4 py-2 rounded-full text-sm inline-flex items-center hover:bg-green-600 transition-colors'>
                  주문 목록 보기
                </button>
              </Link>
            </div>

            <div className='bg-white p-6 rounded-lg border flex flex-col justify-between min-w-[250px]'>
              <h3 className='text-lg font-semibold'>판매 통계</h3>
              <p className='text-sm text-gray-600'>판매 데이터를 확인하세요.</p>
              <Link to='stats/performance' className='mt-4'>
                <button className='bg-purple-500 text-white px-4 py-2 rounded-full text-sm inline-flex items-center hover:bg-purple-600 transition-colors'>
                  통계 보기
                </button>
              </Link>
            </div>
          </div>

          {/* 상품 등록 및 이어서 등록 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white p-5 rounded-lg flex flex-col justify-between items-start mb-6 border min-w-[300px]'>
              {hasPendingProduct ? (
                <div>
                  <p className='text-lg font-semibold'>이어서 상품 등록하기</p>
                  <Link to='products/register'>
                    <button className='bg-indigo-500 text-white px-4 py-2 rounded-full text-sm inline-flex items-center hover:bg-indigo-600 transition-colors mt-2'>
                      이어서 등록하기
                    </button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className='text-lg font-semibold'>새로운 상품을 등록하세요</p>
                  <Link to='products/register'>
                    <button className='bg-red-500 text-white px-4 py-2 rounded-full text-sm inline-flex items-center hover:bg--600 transition-colors mt-2'>
                      상품 등록하기
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className='bg-white p-6 rounded-lg flex flex-col justify-between items-start mb-6 border min-w-[300px]'>
              <div>
                <p className='text-lg font-semibold'>라이브 커머스를 신청하세요</p>
                <Link to='lives/apply'>
                  <button className='bg-orange-500 text-white px-4 py-2 rounded-full text-sm inline-flex items-center hover:bg-orange-600 transition-colors mt-2'>
                    라이브 신청하기
                  </button>
                </Link>
              </div>
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
