import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'
import ProductInfo from './Form/Product/ProductInfo'
import ProductImage from './Form/Product/ProductImage'
import ProductDetails from './Form/Product/ProductDetails'
import ProductDate from './Form/Product/ProductDate'

const Register = () => {
  const [product, setProduct] = useState({
    name: '',
    categoryNo: '',
    companyNo: '',
    price: '',
    salePrice: '',
    stock: '',
    images: [], // API 응답의 images 배열을 그대로 사용
    description: '',
    expiredAt: '',
  })
  const [createdUser] = useState(localStorage.getItem('access_token'))

  const navigate = useNavigate()

  // 이미지 업로드 핸들러 (API 응답 구조 반영, 중복 검사)
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // 중복 검사 (이미 API에서 받은 이미지 또는 업로드한 파일이 있는지 확인)
      const isDuplicate = product.images.some((img) => img.originalName === file.name)

      if (isDuplicate) {
        alert('이미 업로드된 이미지입니다.')
        return
      }

      // 새 이미지 객체 추가 (previewUrl 제거, API 응답과 동일한 구조 유지)
      const newImage = {
        imageNo: null, // 새 이미지에는 ID 없음
        imageUrl: '', // API에서 저장된 URL을 받을 때까지 비워둠
        originalName: file.name, // 원본 파일 이름 저장
        file: file, // 실제 파일 저장
      }

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }))
    }
  }

  // 상품 등록 핸들러 (API 응답 구조 반영)
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!localStorage.getItem('access_token')) {
      alert('상품 등록을 위한 인증이 필요합니다.')
      return
    }

    if (
      !product.name ||
      !product.categoryNo ||
      !product.companyNo ||
      !product.price ||
      !product.salePrice ||
      !product.stock ||
      !product.expiredAt ||
      !product.description ||
      product.images.length === 0 // 최소 한 개의 이미지 필요
    ) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', product.name)
      formData.append('categoryNo', product.categoryNo)
      formData.append('companyNo', product.companyNo)
      formData.append('price', parseFloat(product.price))
      formData.append('salePrice', parseFloat(product.salePrice))
      formData.append('stock', parseInt(product.stock, 10))
      formData.append('expiredAt', product.expiredAt)
      formData.append('description', product.description)
      formData.append('createdUser', createdUser)

      // API 응답과 동일한 images 배열을 유지
      product.images.forEach((img) => {
        if (img.file) {
          formData.append('productImages', img.file) // 새 이미지 업로드
        }
      })

      const response = await API.post('api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.status === 'CREATED') {
        const registeredProduct = response.data.result.data

        // API 응답을 기반으로 product 상태 업데이트
        setProduct({
          name: registeredProduct.name,
          categoryNo: registeredProduct.category.categoryNo,
          companyNo: registeredProduct.companyNo,
          price: registeredProduct.price,
          salePrice: registeredProduct.salePrice,
          stock: registeredProduct.stock,
          images: registeredProduct.images, // API에서 받은 이미지 그대로 저장
          description: registeredProduct.description,
          expiredAt: registeredProduct.expiredAt,
        })

        alert('상품이 등록되었습니다!')
        navigate('/seller/products/inquiry')
      } else {
        alert('상품 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-10'>상품 등록</h1>
      <form onSubmit={handleSubmit}>
        <ProductInfo product={product} setProduct={setProduct} />
        <ProductImage product={product} setProduct={setProduct} />
        <ProductDetails product={product} setProduct={setProduct} />
        <ProductDate product={product} setProduct={setProduct} />
        <button type='submit' className='mt-5 p-3 bg-blue-500 text-white border-black'>
          상품 등록
        </button>
      </form>
    </div>
  )
}

export default Register
