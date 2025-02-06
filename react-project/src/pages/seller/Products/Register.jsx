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
    images: [], // API 응답과 동일한 구조 유지
    description: '',
    expiredAt: '',
  })

  const [createdUser, setCreatedUser] = useState(null)

  // 🔍 토큰 확인 및 인증이 없으면 로그인 페이지로 이동
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('상품 등록을 위해 로그인해주세요.')
      navigate('/login')
    } else {
      setCreatedUser(token)
    }
  }, [navigate])

  // 📸 이미지 업로드 핸들러 (미리보기 추가)
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // 중복 검사 (이미 동일한 파일이 있는지 확인)
      const isDuplicate = product.images.some((img) => img.originalName === file.name)
      if (isDuplicate) {
        alert('이미 업로드된 이미지입니다.')
        return
      }

      // 새로운 이미지 객체 생성
      const newImage = {
        imageNo: null, // 새 이미지이므로 ID 없음
        imageUrl: URL.createObjectURL(file), // 미리보기용 URL 생성
        originalName: file.name,
        file: file, // 실제 파일 저장
      }

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }))
    }
  }

  // ✅ 상품 등록 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault()

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

    setLoading(true) // 로딩 상태 활성화

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

      // 이미지 파일 추가
      product.images.forEach((img) => {
        if (img.file) {
          formData.append('productImages', img.file) // 파일 업로드
        }
      })

      const response = await API.post('api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.status === 'CREATED') {
        const registeredProduct = response.data.result.data

        setProduct({
          name: registeredProduct.name,
          categoryNo: registeredProduct.category.categoryNo,
          companyNo: registeredProduct.companyNo,
          price: registeredProduct.price,
          salePrice: registeredProduct.salePrice,
          stock: registeredProduct.stock,
          images: registeredProduct.images, // API 응답 이미지 그대로 저장
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
