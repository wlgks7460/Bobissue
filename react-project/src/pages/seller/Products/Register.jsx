import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const Register = () => {
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [brandName, setBrandName] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [stock, setStock] = useState('')
  const [productImage, setProductImage] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const navigate = useNavigate()

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    setProductImage(URL.createObjectURL(file))
  }

  const load_data=()=>{
    const response = API.get('api/itemsave')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !productName ||
      !category ||
      !brandName ||
      !price ||
      !discount ||
      !stock ||
      !productImage ||
      !startDate ||
      !endDate
    ) {
      alert('모든 항목을 입력해주세요.')
      return
    }
    try{
      const formdata={
        productName,
        category,
        brandName,
        price: parseFloat(price),
        discount: parseFloat(discount),
        stock: parseInt(stock, 10),
        startDate,
        endDate,
      }
      const response = API.post('items',formdata)
      console.log(response.data);
    }catch (error) {
      console.error('저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    }   

    alert('상품이 등록되었습니다!')
    navigate('/seller/products/inquiry')
  }

  const handleSave = async () => {
    try {
      const formData = {
        productName,
        category,
        brandName,
        price: parseFloat(price),
        discount: parseFloat(discount),
        stock: parseInt(stock, 10),
        startDate,
        endDate,
      }

      const response = await API.post('api/items', formData)
      console.log('저장 성공:', response.data)
      alert('중간 저장 완료!')
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='max-w-4xl mx-auto bg-white shadow-md rounded-md p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>상품 등록</h1>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <section>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>상품 기본 정보</h2>
            <div className='space-y-4'>
              <label className='block'>
                <span className='text-gray-600'>상품명</span>
                <input
                  type='text'
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder='상품명을 입력하세요'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </label>
              <label className='block'>
                <span className='text-gray-600'>카테고리</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                >
                  <option value=''>카테고리를 선택하세요</option>
                  <option value='fruits'>과일</option>
                  <option value='vegetables'>채소</option>
                  <option value='snacks'>과자류</option>
                </select>
              </label>
              <label className='block'>
                <span className='text-gray-600'>브랜드명</span>
                <input
                  type='text'
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder='브랜드명을 입력하세요'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>상품 이미지</h2>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='block w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
            />
            {productImage && (
              <div className='mt-4'>
                <img
                  src={productImage}
                  alt='상품 이미지 미리보기'
                  className='h-40 w-40 object-cover rounded-md border'
                />
              </div>
            )}
          </section>

          <section>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>가격 및 재고</h2>
            <div className='space-y-4'>
              <label className='block'>
                <span className='text-gray-600'>가격(원)</span>
                <input
                  type='number'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder='가격을 입력하세요'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </label>
              <label className='block'>
                <span className='text-gray-600'>할인율(%)</span>
                <input
                  type='number'
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder='할인율을 입력하세요'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </label>
              <label className='block'>
                <span className='text-gray-600'>재고 수량</span>
                <input
                  type='number'
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder='재고 수량을 입력하세요'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>판매 가능 기간</h2>
            <div className='space-y-4'>
              <label className='block'>
                <span className='text-gray-600'>판매 시작일</span>
                <input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </label>
              <label className='block'>
                <span className='text-gray-600'>판매 종료일</span>
                <input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || today}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </label>
            </div>
          </section>

          <div className='flex justify-between items-center mt-6'>
            <button
              type='button'
              onClick={handleSave}
              className='bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded shadow hover:bg-gray-400'
            >
              중간 저장
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white font-medium py-2 px-4 rounded shadow hover:bg-blue-600'
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
