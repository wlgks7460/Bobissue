import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Update = () => {
  const product = useLocation() // 부모에서 전달된 productId

  const [productImage, setProductImage] = useState(null) // 이미지 미리보기 상태
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    img: null,
  })

  // 초기 데이터 로드
  useEffect(() => {
    // 서버에서 기존 상품 데이터를 가져옴
    setFormData({
      name: product.state.name,
      category: product.state.category,
      price: product.state.price,
      stock: product.state.stock, // 실제 서버의 img 데이터가 있다면 활용
    })
    setProductImage(product.state.img) // 기본 이미지 URL 설정
  }, [])

  // 폼 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 이미지 업로드 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }))
      const reader = new FileReader()
      reader.onload = () => setProductImage(reader.result) // 미리보기 이미지 설정
      reader.readAsDataURL(file)
    }
  }

  // 수정 폼 제출 핸들러
  const handleSubmit = () => {
    // 이미지 파일을 포함한 FormData 객체 생성
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('price', formData.price)
    formDataToSend.append('stock', formData.stock)
    if (formData.img) {
      formDataToSend.append('img', formData.img) // 파일 추가
    }

    fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: formDataToSend,
    })
      .then((res) => res.json())
      .then(() => {
        alert('수정 요청이 접수되었습니다. 관리자 승인을 기다려주세요.')
      })
      .catch((err) => console.error('수정 요청 실패:', err))
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>상품 수정</h2>
      <label className='block mb-4'>
        <span className='block text-gray-700'>상품명:</span>
        <input
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200'
        />
      </label>
      <section className='mb-4'>
        <h2 className='text-lg font-semibold'>상품 이미지</h2>
        <input type='file' accept='image/*' onChange={handleImageChange} className='mt-2' />
        {productImage && (
          <div className='mt-4 border p-2 rounded-lg'>
            <img src={productImage} alt='상품 이미지 미리보기' className='w-full rounded-md' />
          </div>
        )}
      </section>
      <label className='block mb-4'>
        <span className='block text-gray-700'>카테고리:</span>
        <input
          name='category'
          value={formData.category}
          onChange={handleChange}
          className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200'
        />
      </label>
      <label className='block mb-4'>
        <span className='block text-gray-700'>가격:</span>
        <input
          name='price'
          value={formData.price}
          onChange={handleChange}
          className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200'
        />
      </label>
      <label className='block mb-4'>
        <span className='block text-gray-700'>재고:</span>
        <input
          name='stock'
          value={formData.stock}
          onChange={handleChange}
          className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200'
        />
      </label>
      <button
        onClick={handleSubmit}
        className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300'
      >
        저장
      </button>
    </div>
  )
}

export default Update
