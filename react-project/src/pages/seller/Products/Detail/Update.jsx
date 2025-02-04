import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '@/utils/API'
//import PostForm from './Form/PostForm'

const EditProduct = () => {
  const { id } = useParams() // URL에서 상품 ID 가져오기
  const [product, setProduct] = useState({
    name: '',
    categoryNo: '',
    companyNo: '',
    price: '',
    salePrice: '',
    stock: '',
    productImage: null,
    previewImage: null,
    description: '',
    expiredAt: '',
  })
  const [createdUser] = useState(localStorage.getItem('SELLER_AUTH_TOKEN')) // 인증된 사용자
  const [updatedUser] = useState(localStorage.getItem('SELLER_AUTH_TOKEN')) // 인증된 사용자
  const navigate = useNavigate()

  useEffect(() => {
    // 상품 데이터 로드
    const fetchProductData = async () => {
      try {
        const response = await API.get(`api/items/${id}`)
        setProduct({
          ...response.data,
          previewImage: response.data.productImage ? `/images/${response.data.productImage}` : null, // 이미지 미리보기
        })
      } catch (error) {
        console.error('상품 데이터를 불러오는 데 실패했습니다.', error)
        alert('상품 데이터를 불러오는 데 실패했습니다.')
      }
    }

    fetchProductData()
  }, [id])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setProduct((prev) => ({
        ...prev,
        productImage: file,
        previewImage: URL.createObjectURL(file),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!localStorage.getItem('SELLER_AUTH_TOKEN')) {
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
      !product.productImage ||
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
      formData.append('productImage', product.productImage)
      formData.append('createdUser', createdUser)
      formData.append('updatedUser', updatedUser)

      const response = await API.put(`api/items/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      console.log('수정 성공:', response.data)
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

      {/* 상품명 */}
      <div className='flex items-center space-x-2'>
        <h2 className='text-[16px] font-bold'>상품명</h2>
      </div>
      <input
        className='w-[800px] mt-3 p-3 border rounded-md'
        type='text'
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder='상품명을 입력해주세요'
      />

      {/* 카테고리 선택 */}
      <div className='mt-3'>
        <label className='block text-[16px] font-bold mb-2'>카테고리</label>
        <select
          className='w-[400px] p-2 border rounded-md'
          value={product.categoryNo}
          onChange={(e) => setProduct({ ...product, categoryNo: e.target.value })}
        >
          <option value=''>카테고리 선택</option>
          <option value='1'>식품</option>
          <option value='2'>비식품</option>
        </select>
      </div>

      {/* 회사명 선택 */}
      <div className='mt-3'>
        <label className='block text-[16px] font-bold mb-2'>회사명</label>
        <input
          className='w-[400px] p-3 border rounded-md'
          type='text'
          placeholder='회사명을 입력하세요'
          value={product.companyNo}
          onChange={(e) => setProduct({ ...product, companyNo: e.target.value })}
        />
      </div>

      {/* 상품 이미지 업로드 */}
      <div className='mt-5'>
        <h2 className='text-[16px] font-bold'>상품 이미지</h2>
        <label className='mt-3 flex items-center justify-center w-[300px] h-[300px] border-2 border-dashed border-gray-400 rounded-lg cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200'>
          {product.previewImage ? (
            <img
              src={product.previewImage}
              alt='상품 이미지 미리보기'
              className='w-full h-full object-cover'
            />
          ) : (
            <span className='text-gray-500'>클릭하여 이미지를 업로드하세요</span>
          )}
          <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
        </label>
      </div>

      {/* 상품 정보 */}
      <div className='mt-5 p-2 border rounded-lg bg-gray-50'>
        <h2 className='text-[16px] font-bold'>상품 주요 정보</h2>
        <input
          className='w-[400px] mt-2 p-3 border rounded-md'
          type='number'
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          placeholder='상품 가격'
        />
        <input
          className='w-[400px] mt-2 p-3 border rounded-md'
          type='number'
          value={product.salePrice}
          onChange={(e) => setProduct({ ...product, salePrice: e.target.value })}
          placeholder='할인 가격'
        />
        <input
          className='w-[400px] mt-2 p-3 border rounded-md'
          type='number'
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          placeholder='재고 수량'
        />
        <textarea
          className='w-[800px] mt-2 p-3 border rounded-md h-[100px]'
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          placeholder='상품의 특징을 입력해주세요'
        ></textarea>
      </div>

      {/* 판매 종료일 */}
      <div className='flex items-center space-x-2 mt-5'>
        <h2 className='text-[16px] font-bold'>판매 종료일</h2>
      </div>
      <input
        className='w-[400px] mt-3 p-2 border rounded-md'
        type='date'
        value={product.expiredAt}
        onChange={(e) => setProduct({ ...product, expiredAt: e.target.value })}
      />

      {/* 상품 수정 버튼 */}
      <button className='mt-5 p-3 bg-blue-500 text-white rounded-md' onClick={handleSubmit}>
        상품 수정
      </button>
    </div>
  )
}

export default EditProduct
