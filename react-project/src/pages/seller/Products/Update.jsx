import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '@/utils/API'
import ProductInfo from './Form/Product/ProductInfo'
import ProductImage from './Form/Product/ProductImage'
import ProductDetails from './Form/Product/ProductDetails'
import ProductDate from './Form/Product/ProductDate'

const EditProduct = () => {
  const { itemNo } = useParams() // URL에서 상품 ID 가져오기
  const [product, setProduct] = useState({
    name: '',
    categoryNo: '',
    price: '',
    salePrice: '',
    stock: '',
    images: [],
    description: '',
    expiredAt: '',
  })
  const [originalProduct, setOriginalProduct] = useState(null) // ✅ 기존 상품 데이터 저장
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await API.get(`item/${itemNo}`)
        const itemData = response.data.result.data

        const formattedProduct = {
          name: itemData.name,
          categoryNo: itemData.category?.categoryNo || '',
          price: itemData.price || '',
          salePrice: itemData.salePrice || '',
          stock: itemData.stock || '',
          images: itemData.images || [],
          description: itemData.description || '',
          expiredAt: itemData.expiredAt || '',
        }

        setProduct(formattedProduct)
        setOriginalProduct(formattedProduct) // ✅ 기존 데이터 저장
      } catch (error) {
        console.error('상품 데이터를 불러오는 데 실패했습니다.', error)
        alert('상품 데이터를 불러오는 데 실패했습니다.')
      }
    }

    fetchProductData()
  }, [itemNo])

  // ✅ 변경 여부 확인 함수
  const isProductChanged = () => {
    if (!originalProduct) return true // 기존 데이터가 없으면 수정 가능
    return JSON.stringify(originalProduct) !== JSON.stringify(product)
  }

  // ✅ 폼 제출 핸들러 (상품 수정)
  // ✅ 폼 제출 핸들러 (상품 수정)
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!localStorage.getItem('access_token')) {
      alert('상품 수정에 대한 인증이 필요합니다.')
      return
    }

    if (
      !product.name ||
      !product.categoryNo ||
      !product.price ||
      !product.salePrice ||
      !product.stock ||
      !product.expiredAt ||
      !product.description
    ) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    // ✅ 기존 값과 동일하면 제출 불가
    if (!isProductChanged()) {
      alert('수정된 내용이 없습니다.')
      return
    }

    try {
      const formData = new FormData()

      // ✅ 상품 데이터 JSON 변환 후 추가
      const itemData = {
        name: product.name,
        categoryNo: product.categoryNo,
        price: parseFloat(product.price),
        salePrice: parseFloat(product.salePrice),
        stock: parseInt(product.stock, 10),
        expiredAt: product.expiredAt,
        description: product.description,
      }

      formData.append('item', JSON.stringify(itemData))

      // ✅ 이미지 파일 추가
      product.images.forEach((img) => {
        if (img.file) {
          formData.append('images', img.file) // 새 이미지 업로드
        }
      })

      await API.put(`/item/${itemNo}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      alert('상품이 수정되었습니다!')
      navigate('/seller/products/inquiry')
    } catch (error) {
      console.error('수정 실패:', error)
      alert('수정 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-10'>상품 수정</h1>
      <form onSubmit={handleSubmit}>
        <ProductInfo product={product} setProduct={setProduct} />
        <ProductImage product={product} setProduct={setProduct} />
        <ProductDetails product={product} setProduct={setProduct} />
        <ProductDate product={product} setProduct={setProduct} />
        <button
          type='submit'
          className='mt-5 p-1 bg-lime-700 text-white border-black disabled:bg-gray-300'
          disabled={!isProductChanged()} // ✅ 변경된 내용 없으면 버튼 비활성화
        >
          상품 수정
        </button>
      </form>
    </div>
  )
}

export default EditProduct
