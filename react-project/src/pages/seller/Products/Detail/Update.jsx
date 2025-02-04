import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Update = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  const [productImage, setProductImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    img: null,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
      });
      setProductImage(product.productImage);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }));
      const reader = new FileReader();
      reader.onload = () => setProductImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    if (formData.img) {
      formDataToSend.append('img', formData.img);
    }

    try {
      const response = await fetch(`/api/products/${product.name}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('수정 요청이 접수되었습니다. 관리자 승인을 기다려주세요.');
        navigate('/');
      } else {
        alert('수정 요청을 처리하는 데 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('수정 요청 오류:', error);
      alert('수정 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='p-6 bg-white rounded-lg max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-center border-b pb-4'>상품 수정</h1>
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <h2 className='text-lg font-semibold mb-2'>상품 이미지</h2>
          <input type='file' accept='image/*' onChange={handleImageChange} className='mt-2' />
          {productImage && (
            <div className='mt-4 border p-2 rounded-lg'>
              <img src={productImage} alt='상품 이미지 미리보기' className='w-full rounded-md' />
            </div>
          )}
        </div>
        <div className='space-y-4'>
          <label className='block'>
            <span className='block text-gray-700'>상품명:</span>
            <input
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200'
            />
          </label>
          <label className='block'>
            <span className='block text-gray-700'>카테고리:</span>
            <input
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200'
            />
          </label>
          <label className='block'>
            <span className='block text-gray-700'>가격:</span>
            <input
              name='price'
              value={formData.price}
              onChange={handleChange}
              className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200'
            />
          </label>
          <label className='block'>
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
            수정 요청 보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Update;