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
  const debug_mode = localStorage.getItem('debug_mode') === 'true' // ✅ 디버그 모드 추가

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

  // ✅ 로그인 확인 및 인증되지 않으면 로그인 페이지로 이동
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('상품 등록을 위해 로그인해주세요.')
      navigate('/seller/login')
    }
  }, [navigate])

  const handleRemoveImage = (imageIndex) => {
    setProduct((prev) => {
      const imageUrlToRevoke = prev.images[imageIndex]?.imageUrl
      const newImages = prev.images.filter((_, index) => index !== imageIndex)

      if (imageUrlToRevoke) {
        URL.revokeObjectURL(imageUrlToRevoke)
      }

      return { ...prev, images: newImages }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 필수 항목 체크
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

    setLoading(true)

    try {
      const formData = new FormData()

      const productData = {
        categoryNo: parseInt(product.categoryNo, 10),
        name: product.name,
        price: parseFloat(product.price),
        salePrice: parseFloat(product.salePrice),
        stock: parseInt(product.stock, 10),
        expiredAt: product.expiredAt,
        description: product.description,
      }

      formData.append('item', JSON.stringify(productData))

      if (product.images.length > 0) {
        product.images.forEach((img) => {
          if (img.file) {
            formData.append('images', img.file)
          }
        })
      }

      if (debug_mode) {
        console.log('📌 [DEBUG MODE] 상품 등록 요청 데이터:', {
          item: productData,
          images: product.images.map((img) => img.file?.name),
        })
        setLoading(false)
        return
      }

      for (const pair of formData.entries()) {
        console.log(`📌 FormData 확인: ${pair[0]} →`, pair[1])
      }

      const response = await API.post('/item', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.status === 'CREATED') {
        alert('✅ 상품이 성공적으로 등록되었습니다!')
        navigate('/seller/products/search')
      } else {
        alert(`❌ 상품 등록 실패: ${response.data.message.label || '알 수 없는 오류'}`)
      }
    } catch (error) {
      console.error('상품 저장 실패:', error)
      alert('❌ 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-10 text-center'>상품 등록</h1>
      <form onSubmit={handleSubmit}>
        <ProductImage
          product={product}
          handleRemoveImage={handleRemoveImage}
          setProduct={setProduct}
        />
        <ProductInfo product={product} setProduct={setProduct} />
        <ProductDetails product={product} setProduct={setProduct} />
        <ProductDate product={product} setProduct={setProduct} />

        <div className='text-center mt-6'>
          <button
            type='submit'
            className={`mt-5 p-3 text-white rounded-[12px] w-full md:w-auto ${
              loading ? 'bg-amber-600 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'
            }`}
            disabled={loading}
          >
            {loading ? '등록 중...' : '상품 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Register
