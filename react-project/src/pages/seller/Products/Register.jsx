import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'
import PostForm from './Form/PostForm'

const Register = () => {
  const [productName, setProductName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [category, setCategory] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [stock, setStock] = useState('')
  const [productImage, setProductImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [startDate, setStartDate] = useState('') // 판매 시작일 추가
  const [endDate, setEndDate] = useState('') // 판매 종료일 추가
  const [originAddress, setOriginAddress] = useState('')
  const [originDetailAddress, setOriginDetailAddress] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryDetailAddress, setDeliveryDetailAddress] = useState('')
  const [productDescription, setProductDescription] = useState('')

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

    if (
      !productName ||
      !displayName ||
      !category ||
      !companyName ||
      !price ||
      !discount ||
      !stock ||
      !productImage ||
      !startDate ||
      !endDate ||
      !originAddress ||
      !originDetailAddress ||
      !deliveryAddress ||
      !deliveryDetailAddress ||
      !productDescription
    ) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('productName', productName)
      formData.append('displayName', displayName)
      formData.append('category', category)
      formData.append('brandName', brandName)
      formData.append('price', parseFloat(price))
      formData.append('discount', parseFloat(discount))
      formData.append('stock', parseInt(stock, 10))
      formData.append('startDate', startDate)
      formData.append('endDate', endDate)
      formData.append('originAddress', originAddress)
      formData.append('originDetailAddress', originDetailAddress)
      formData.append('deliveryAddress', deliveryAddress)
      formData.append('deliveryDetailAddress', deliveryDetailAddress)
      formData.append('productDescription', productDescription)
      formData.append('productImage', productImage)

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
    <div className="p-6">
      <h1 className="font-bold text-[32px] mb-10">상품 등록</h1>

        {/* 상품명 */}
        <div className="flex items-center space-x-2">
          <h2 className="text-[16px] font-bold">등록상품명</h2>
        </div>
        <input className="w-[800px] mt-3 p-3 border rounded-md" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="상품명을 입력해주세요" />

        {/* 노출상품명 */}
        <div className="flex items-center space-x-2 mt-5">
          <h2 className="text-[16px] font-bold">노출상품명</h2>
        </div>
        <input className="w-[800px] mt-3 p-3 border rounded-md" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="노출될 상품명을 입력해주세요" />
     
        
        
      {/* 카테고리 선택 */}
      
      <div className="mt-3">
        <label className="block text-[16px] font-bold mb-2">카테고리</label>
        <select
          className="w-[400px] p-2 border rounded-md"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">카테고리 선택</option>
          <option value="식품">식품</option>
          <option value="비식품">비식품</option>
        </select>
      </div>

      {/* 회사명 입력 */}
      <div className="mt-3">
        <label className="block text-[16px] font-bold mb-2">회사명</label>
        <input
          className="w-[400px] p-3 border rounded-md"
          type="text"
          placeholder="회사명을 입력하세요"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
  
        {/* 상품 이미지 업로드 */}
        <div className="mt-5">
      <h2 className="text-[16px] font-bold">상품 이미지</h2>
      <label
        className="mt-3 flex items-center justify-center w-[300px] h-[300px] border-2 border-dashed border-gray-400 rounded-lg cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200"
      >
        {previewImage ? (
          <img src={previewImage} alt="상품 이미지 미리보기" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">클릭하여 이미지를 업로드하세요</span>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </label>
    </div>

        {/* 상품 정보 */}
        <div className="mt-5 p-2 border rounded-lg bg-gray-50">
          <h2 className="text-[16px] font-bold">상품 주요 정보</h2>
          <input className="w-[400px] mt-2 p-3 border rounded-md" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="상품 가격" />
          <input className="w-[400px] mt-2 p-3 border rounded-md" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="할인율 (%)" />
          <input className="w-[400px] mt-2 p-3 border rounded-md" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="재고 수량" />
          <textarea className="w-[800px] mt-2 p-3 border rounded-md h-[100px]" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="상품의 특징을 입력해주세요"></textarea>
        </div>
        {/* 판매 시작일 */}
        <div className="flex items-center space-x-2 mt-5">
          <h2 className="text-[16px] font-bold">판매 시작일</h2>
        </div>
        <input className="w-[400px] mt-3 p-2 border rounded-md" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        {/* 판매 종료일 */}
        <div className="flex items-center space-x-2 mt-5">
          <h2 className="text-[16px] font-bold">판매 종료일</h2>
        </div>
        <input className="w-[400px] mt-3 p-2 border rounded-md" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <PostForm title="출고지" setAddress={setOriginAddress} />
        <input className="w-[800px] mt-3 p-3 border rounded-md" type="text" value={originAddress} readOnly placeholder="출고지 주소" />
        <input className="w-[800px] mt-3 p-3 border rounded-md" type="text" value={originDetailAddress} onChange={(e) => setOriginDetailAddress(e.target.value)} placeholder="출고지 상세주소" />

        <PostForm title="배송지" setAddress={setDeliveryAddress} />
        
        <input className="w-[800px] mt-3 p-3 border rounded-md" type="text" value={deliveryAddress} readOnly placeholder="배송지 주소" />
        <input className="w-[800px] mt-3 p-3 border rounded-md" type="text" value={deliveryDetailAddress} onChange={(e) => setDeliveryDetailAddress(e.target.value)} placeholder="배송지 상세주소" />
        {/* 상품 등록 버튼 */}
        <button className="mt-5 p-3 bg-blue-500 text-white rounded-md" onClick={handleSubmit}>상품 등록</button>
    </div>
  )
}

export default Register
