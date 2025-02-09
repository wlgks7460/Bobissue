import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'
import ProductInfo from './Form/Product/ProductInfo'
import ProductImage from './Form/Product/ProductImage'
import ProductDetails from './Form/Product/ProductDetails'
import ProductDate from './Form/Product/ProductDate'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState({
    name: '',
    categoryNo: '',
    companyNo: '',
    price: '',
    salePrice: '',
    stock: '',
    images: [],
    description: '',
    expiredAt: '',
  })

  const [createdUser, setCreatedUser] = useState(null)

  // ✅ 로그인 확인 및 인증되지 않으면 로그인 페이지로 이동
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('상품 등록을 위해 로그인해주세요.')
      navigate('/login')
    } else {
      setCreatedUser(token)
    }
  }, [navigate])

  // 📸 **이미지 업로드 핸들러 (중복 체크 & 미리보기 추가)**
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const isDuplicate = product.images.some((img) => img.originalName === file.name)
      if (isDuplicate) {
        alert('이미 업로드된 이미지입니다.')
        return
      }

      const newImage = {
        imageNo: null,
        imageUrl: URL.createObjectURL(file),
        originalName: file.name,
        file: file,
      }

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }))
    }
  }

  // ✅ 상품 등록 요청 함수
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 필수 항목 체크
    if (
      !product.name ||
      !product.categoryNo ||
      !product.companyNo ||
      !product.price ||
      !product.salePrice ||
      !product.stock ||
      !product.expiredAt ||
      !product.description ||
      product.images.length === 0
    ) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    setLoading(true) // 로딩 시작

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

      // ✅ 이미지 파일 추가
      product.images.forEach((img) => {
        if (img.file) {
          formData.append('productImages', img.file)
        }
      })

      // ✅ 상품 등록 API 요청
      const response = await API.post('api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.status === 'CREATED') {
        const registeredProduct = response.data.result.data

        // ✅ API 응답에 맞게 상태 업데이트
        setProduct({
          name: registeredProduct.name,
          categoryNo: registeredProduct.category.categoryNo, // ✅ 변경된 구조 반영
          companyNo: registeredProduct.companyNo.companyNo, // ✅ 변경된 구조 반영
          price: registeredProduct.price,
          salePrice: registeredProduct.salePrice,
          stock: registeredProduct.stock,
          images: registeredProduct.images.map((img) => ({
            imageNo: img.imageNo,
            imageUrl: img.imageUrl,
            originalName: img.originalName,
          })),
          description: registeredProduct.description,
          expiredAt: registeredProduct.expiredAt,
        })

        alert('✅ 상품이 성공적으로 등록되었습니다!')
        navigate('/seller/products/inquiry')
      } else {
        alert(`❌ 상품 등록 실패: ${response.data.message || '알 수 없는 오류'}`)
      }
    } catch (error) {
      console.error('상품 저장 실패:', error)
      alert('❌ 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false) // 로딩 종료
    }
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-10'>🛍️ 상품 등록</h1>
      <form onSubmit={handleSubmit}>
        <ProductImage product={product} setProduct={setProduct} />
        <ProductInfo product={product} setProduct={setProduct} />
        <ProductDetails product={product} setProduct={setProduct} />
        <ProductDate product={product} setProduct={setProduct} />

        <button
          type='submit'
          className={`mt-5 p-3 text-white border-black ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? '등록 중...' : '상품 등록'}
        </button>
      </form>
    </div>
  )
}

export default Register
