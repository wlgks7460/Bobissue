import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'

const SellerDetail = () => {
  // URL 파라미터에서 sellerNo를 받아온다고 가정
  const { sellerNo } = useParams()
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자 관리' }, { name: '판매자 상세' }]

  // 판매자 정보 (예제에서는 하드코딩; 실제로는 sellerNo를 이용해 API로 상세 정보를 받아오면 됨)
  const [seller, setSeller] = useState({ sellerNo, companyNo: 1, name: '판매자 이름' })
  // 상품 목록 상태
  const [items, setItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [itemsError, setItemsError] = useState(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // 상품 전체 조회 API 호출 (API 유틸리티가 기본 URL을 가지고 있다고 가정)
        const response = await API.get('/item')
        console.log('상품 전체 조회 응답:', response)
        const allItems = response.data.result.data
        // 판매자의 회사번호와 일치하는 상품 필터링
        const sellerItems = allItems.filter(
          (item) => item.companyNo && item.companyNo.companyNo === seller.companyNo,
        )
        setItems(sellerItems)
      } catch (error) {
        console.error('상품 조회 중 오류 발생:', error)
        setItemsError(error)
      } finally {
        setItemsLoading(false)
      }
    }
    fetchItems()
  }, [seller.companyNo])

  return (
    <div className='p-6 bg-white min-h-screen'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 상세조회</h1>

      {/* 판매자 정보 */}
      <div className='mb-6'>
        <h2 className='text-xl font-semibold'>판매자: {seller.name}</h2>
      </div>

      {/* 상품 목록 영역 */}
      {itemsLoading ? (
        <p className='text-center text-gray-500'>상품 목록 로딩 중...</p>
      ) : itemsError ? (
        <p className='text-center text-red-500'>상품 조회 중 오류 발생</p>
      ) : (
        <div className='overflow-x-auto'>
          {items.length > 0 ? (
            <table className='min-w-full border-collapse border border-gray-300'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-4 py-2'>상품번호</th>
                  <th className='border px-4 py-2'>상품명</th>
                  <th className='border px-4 py-2'>카테고리</th>
                  <th className='border px-4 py-2'>가격</th>
                  <th className='border px-4 py-2'>할인가격</th>
                  <th className='border px-4 py-2'>설명</th>
                  <th className='border px-4 py-2'>이미지</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.itemNo} className='hover:bg-gray-50'>
                    <td className='border px-4 py-2 text-center'>{item.itemNo}</td>
                    <td className='border px-4 py-2'>{item.name}</td>
                    <td className='border px-4 py-2'>
                      {item.category
                        ? `${item.category.parentName ? item.category.parentName + ' > ' : ''}${item.category.name}`
                        : 'N/A'}
                    </td>
                    <td className='border px-4 py-2 text-right'>{item.price}원</td>
                    <td className='border px-4 py-2 text-right'>
                      {item.salePrice ? item.salePrice + '원' : '-'}
                    </td>
                    <td className='border px-4 py-2'>{item.description}</td>
                    <td className='border px-4 py-2 text-center'>
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0].imageUrl}
                          alt={item.name}
                          className='w-20 h-20 object-cover mx-auto'
                        />
                      ) : (
                        '없음'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='text-center text-gray-500'>등록된 상품이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SellerDetail
