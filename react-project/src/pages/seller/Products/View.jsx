import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '@/utils/API'

const View = () => {
  const navigate = useNavigate()
  const { itemNo } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/item/${itemNo}`)
        console.log('📌 상품 상세 API 응답:', response.data)

        if (response.data.status === 'OK' && response.data.result?.data) {
          const item = response.data.result.data
          setProduct({
            itemNo: item.itemNo,
            name: item.name,
            category: `${item.category.parentName} > ${item.category.name}`,
            productImage: item.images?.[0]?.imageUrl || '',
            company: item.company?.name || '회사 정보 없음',
            companyNo: item.company?.companyNo,
            price: item.price,
            salePrice: item.salePrice,
            stock: item.stock,
            expiredAt: item.expiredAt,
            description: item.description,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
          })
        } else {
          console.error('상품 데이터 조회 실패:', response.data.message?.label || '알 수 없는 오류')
        }
      } catch (error) {
        console.error('API 요청 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [itemNo])

  const handleUpdateClick = () => {
    navigate('update', { state: product })
  }

  const handleDeleteClick = async () => {
    const isConfirmed = window.confirm(`'${product.name}' 상품을 삭제하시겠습니까?`)
    if (isConfirmed) {
      try {
        const response = await API.delete(`/item/${itemNo}`)
        console.log(response)
        if (response.status === 200) {
          alert('상품이 삭제되었습니다.')
          navigate('/seller/products/search')
        } else {
          alert('삭제 요청을 처리하는 데 실패했습니다. 다시 시도해주세요.')
        }
      } catch (error) {
        console.error('삭제 요청 오류:', error)
        alert('삭제 요청 중 오류가 발생했습니다.')
      }
    }
  }

  if (loading) {
    return <p className='text-center text-gray-600 mt-10'>상품 정보를 불러오는 중...</p>
  }

  return (
    <div className='W p-8 min-h-screen flex items-center justify-center'>
      <div className='p-8 bg-white rounded-xl shadow-lg max-w-4xl w-full border-2 border-deepCobalt'>
        <h1 className='text-3xl font-bold mb-6 text-deepCobalt text-center border-b pb-4'>
          상품 상세정보
        </h1>

        <div className='grid grid-cols-2 gap-8'>
          {/* ✅ 상품 이미지 */}
          <div className='flex justify-center'>
            {product.productImage ? (
              <img
                src={product.productImage}
                alt={product.name}
                className='w-full object-cover rounded-lg border shadow-md'
              />
            ) : (
              <p className='text-center text-gray-500'>이미지가 없습니다.</p>
            )}
          </div>

          {/* ✅ 상품 상세 정보 */}
          <div className='space-y-3'>
            <h2 className='text-2xl font-semibold text-deepCobalt'>{product.name}</h2>
            <p className='text-gray-700'>
              <span className='font-medium text-deepCobalt'>카테고리:</span> {product.category}
            </p>
            <p className='text-gray-700'>
              <span className='font-medium text-deepCobalt'>회사:</span> {product.company}
            </p>
            <p className='text-xl font-bold'>
              <span className='font-medium text-deepCobalt'>가격: </span>
              {product.salePrice.toLocaleString()}원{' '}
              <del className='text-gray-500 text-lg ml-2'>{product.price.toLocaleString()}원</del>
            </p>
            <p className='text-gray-700'>
              <span className='font-medium text-deepCobalt'>재고:</span>{' '}
              <span
                className={`font-semibold ${
                  product.stock <= 5 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {product.stock}개 {product.stock <= 5 && '(재고 부족)'}
              </span>
            </p>
            <p className='text-gray-700'>
              <span className='font-medium text-deepCobalt'>등록일:</span> {product.createdAt}
            </p>
            <p className='text-gray-700'>
              <span className='font-medium text-deepCobalt'>판매 종료일:</span> {product.expiredAt}
            </p>
            <p className='text-gray-800'>{product.description || '상품 설명이 없습니다.'}</p>

            {/* ✅ 액션 버튼 */}
            <div className='flex space-x-4 mt-6'>
              <button
                onClick={handleUpdateClick}
                className='bg-coralReef text-white px-4 py-2 rounded-lg hover:bg-deepCobalt focus:ring focus:ring-deepCobalt/50 transition-all hover:scale-105'
              >
                수정하기
              </button>
              <button
                onClick={handleDeleteClick}
                className='bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring focus:ring-red-300 transition-all hover:scale-105'
              >
                삭제 요청
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default View
