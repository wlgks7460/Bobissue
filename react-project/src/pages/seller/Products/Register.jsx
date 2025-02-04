import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'
//import PostForm from '/Form/PostForm'

const Register = () => {
  const [name, setName] = useState('') // 상품명 -> name
  const [categoryNo, setCategoryNo] = useState('') // 카테고리 -> categoryNo
  const [companyNo, setCompanyNo] = useState('') // 회사명 -> companyNo
  const [price, setPrice] = useState('') // 상품 가격 -> price
  const [salePrice, setSalePrice] = useState('') // 할인 가격 -> salePrice
  const [stock, setStock] = useState('') // 재고 수량 -> stock
  const [productImage, setProductImage] = useState(null) // 상품 이미지 -> imageNo
  const [previewImage, setPreviewImage] = useState(null)
  const [description, setDescription] = useState('') // 상품 설명 -> description
  const [expiredAt, setExpiredAt] = useState('') // 판매 종료일 -> expiredAt
  const [createdUser, setCreatedUser] = useState(localStorage.getItem('SELLER_AUTH_TOKEN')) // createdUser -> 인증된 사용자 (토큰)
  const [updatedUser, setUpdatedUser] = useState(localStorage.getItem('SELLER_AUTH_TOKEN')) // updatedUser -> 인증된 사용자 (토큰)

  const navigate = useNavigate()

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setProductImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!localStorage.getItem('SELLER_AUTH_TOKEN')) {
      alert('상품 등록을 위한 인증이 필요합니다.')
      return
    }

    if (
      !name ||
      !categoryNo ||
      !companyNo ||
      !price ||
      !salePrice ||
      !stock ||
      !productImage ||
      !expiredAt ||
      !description
    ) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('categoryNo', categoryNo)
      formData.append('companyNo', companyNo)
      formData.append('price', parseFloat(price))
      formData.append('salePrice', parseFloat(salePrice))
      formData.append('stock', parseInt(stock, 10))
      formData.append('expiredAt', expiredAt)
      formData.append('description', description)
      formData.append('productImage', productImage)
      formData.append('createdUser', createdUser)
      formData.append('updatedUser', updatedUser)

      const response = await API.post('api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      console.log('저장 성공:', response.data)
      alert('상품이 등록되었습니다!')
      navigate('/seller/products/inquiry')
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-10'>상품 등록</h1>

      {/* 상품명 */}
      <div className='flex items-center space-x-2'>
        <h2 className='text-[16px] font-bold'>상품명</h2>
      </div>
      <input
        className='w-[800px] mt-3 p-3 border rounded-md'
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='상품명을 입력해주세요'
      />

      {/* 카테고리 선택 */}
      <div className='mt-3'>
        <label className='block text-[16px] font-bold mb-2'>카테고리</label>
        <select
          className='w-[400px] p-2 border rounded-md'
          value={categoryNo}
          onChange={(e) => setCategoryNo(e.target.value)}
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
          value={companyNo}
          onChange={(e) => setCompanyNo(e.target.value)}
        />
      </div>

      {/* 상품 이미지 업로드 */}
      <div className='mt-5'>
        <h2 className='text-[16px] font-bold'>상품 이미지</h2>
        <label className='mt-3 flex items-center justify-center w-[300px] h-[300px] border-2 border-dashed border-gray-400 rounded-lg cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200'>
          {previewImage ? (
            <img
              src={previewImage}
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
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder='상품 가격'
        />
        <input
          className='w-[400px] mt-2 p-3 border rounded-md'
          type='number'
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder='할인 가격'
        />
        <input
          className='w-[400px] mt-2 p-3 border rounded-md'
          type='number'
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder='재고 수량'
        />
        <textarea
          className='w-[800px] mt-2 p-3 border rounded-md h-[100px]'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        value={expiredAt}
        onChange={(e) => setExpiredAt(e.target.value)}
      />

      {/* 상품 등록 버튼 */}
      <button className='mt-5 p-3 bg-blue-500 text-white rounded-md' onClick={handleSubmit}>
        상품 등록
      </button>
    </div>
  )
}

export default Register
