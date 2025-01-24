import React, { useState } from 'react'

const CategoryManagementForm = () => {
  const [categories, setCategories] = useState([
    { id: '001', name: '닭가슴살', count: 8 },
    { id: '002', name: '샐러드', count: 5 },
    { id: '003', name: '도시락', count: 5 },
    { id: '004', name: '저속노화건강식', count: 3 },
    { id: '005', name: '체중감량식', count: 6 },
    { id: '006', name: '채식', count: 4 },
    { id: '007', name: '저탄고지 식단', count: 10 },
    { id: '008', name: '노탄수화물 식단', count: 5 },
  ])

  const [formData, setFormData] = useState({
    parentCategory: '',
    subCategory: '',
    categoryName: '',
    bannerFile: null,
    bannerLink: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, bannerFile: e.target.files[0] }))
  }

  const handleSave = () => {
    if (formData.categoryName.trim() === '') {
      alert('카테고리명을 입력해주세요.')
      return
    }

    const newCategory = {
      id: String(categories.length + 1).padStart(3, '0'),
      name: formData.categoryName,
      count: 0,
    }

    setCategories((prev) => [...prev, newCategory])
    alert('카테고리가 저장되었습니다.')
  }

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>카테고리 관리</h1>
      <h2 className='text-lg font-semibold mb-4'>카테고리 등록</h2>
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div>
          <label className='block text-sm font-medium mb-1'>카테고리 소속</label>
          <select
            name='parentCategory'
            value={formData.parentCategory}
            onChange={handleInputChange}
            className='border rounded-md px-3 py-2 w-full'
          >
            <option value=''>=카테고리 선택=</option>
            <option value='닭가슴살'>닭가슴살</option>
            <option value='샐러드'>샐러드</option>
            <option value='도시락'>도시락</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>카테고리명</label>
          <input
            type='text'
            name='categoryName'
            value={formData.categoryName}
            onChange={handleInputChange}
            className='border rounded-md px-3 py-2 w-full'
            placeholder='카테고리명을 입력하세요'
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>카테고리 상단배너</label>
          <input
            type='file'
            name='bannerFile'
            onChange={handleFileChange}
            className='border rounded-md px-3 py-2 w-full'
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>카테고리 상단배너 링크</label>
          <input
            type='text'
            name='bannerLink'
            value={formData.bannerLink}
            onChange={handleInputChange}
            className='border rounded-md px-3 py-2 w-full'
            placeholder='예시: /shop/view.php?index_no=1'
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-6'
      >
        저장
      </button>

      <h2 className='text-lg font-semibold mb-4'>카테고리 목록</h2>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>카테고리명</th>
            <th className='border px-4 py-2'>상품 개수</th>
            <th className='border px-4 py-2'>수정</th>
            <th className='border px-4 py-2'>삭제</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className='border px-4 py-2 text-center'>{cat.id}</td>
              <td className='border px-4 py-2'>{cat.name}</td>
              <td className='border px-4 py-2 text-center'>{cat.count}</td>
              <td className='border px-4 py-2 text-center'>
                <button className='bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600'>
                  수정
                </button>
              </td>
              <td className='border px-4 py-2 text-center'>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoryManagementForm
