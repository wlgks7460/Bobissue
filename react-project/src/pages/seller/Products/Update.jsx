import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '@/utils/API'
import ProductInfo from './Form/Product/ProductInfo'
import ProductImage from './Form/Product/ProductImage'
import ProductDetails from './Form/Product/ProductDetails'
import ProductDate from './Form/Product/ProductDate'

const EditProduct = () => {
  const { id } = useParams() // URL에서 상품 ID 가져오기
  const [product, setProduct] = useState({
    name: '',
    categoryNo: '',
    companyNo: '',
    price: '',
    salePrice: '',
    stock: '',
    images: [], // 빈 배열로 초기화하여 undefined 방지
    description: '',
    expiredAt: '',
  })
  const [createdUser] = useState(localStorage.getItem('access_token'))
  const [updatedUser] = useState(localStorage.getItem('access_token'))
  const navigate = useNavigate()

  // 기존 상품 데이터 불러오기
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await API.get(`api/items/${id}`)
        const itemData = response.data.result.data // 응답 데이터 구조 반영

        setProduct({
          name: itemData.name,
          categoryNo: itemData.category?.categoryNo || '', // category가 없을 경우 대비
          companyNo: itemData.companyNo || '',
          price: itemData.price || '',
          salePrice: itemData.salePrice || '',
          stock: itemData.stock || '',
          images: itemData.images || [], // undefined 방지 (빈 배열 기본값)
          description: itemData.description || '',
          expiredAt: itemData.expiredAt || '',
        })
      } catch (error) {
        console.error('상품 데이터를 불러오는 데 실패했습니다.', error)
        alert('상품 데이터를 불러오는 데 실패했습니다.')
      }
    }

    fetchProductData()
  }, [id])

  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setProduct((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            imageNo: null, // 새 이미지이므로 imageNo 없음
            imageUrl: URL.createObjectURL(file), // 미리보기 URL
            originalName: file.name,
            file: file,
          },
        ],
      }))
    }
  }

  // 폼 제출 핸들러 (상품 수정)
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!localStorage.getItem('access_token')) {
      alert('상품 수정에 대한 인증이 필요합니다.')
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
      !product.description
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

      // 기존 이미지 및 새 이미지 처리
      product.images.forEach((img) => {
        if (img.file) {
          formData.append('productImages', img.file) // 새 이미지 업로드
        }
      })

      formData.append('createdUser', createdUser)
      formData.append('updatedUser', updatedUser)

      await API.put(`api/items/${id}`, formData, {
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
        <button type='submit' className='mt-5 p-3 bg-blue-500 text-white border-black'>
          상품 수정
        </button>
      </form>
    </div>
  )
}

export default EditProduct
