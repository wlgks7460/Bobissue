import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '@/utils/API'
import ProductInfo from './Form/Product/ProductInfo'
import ProductImage from './Form/Product/ProductImage'
import ProductDetails from './Form/Product/ProductDetails'
import ProductDate from './Form/Product/ProductDate'

const EditProduct = () => {
  const { itemNo } = useParams() // URL에서 상품 ID 가져오기
  const [product, setProduct] = useState({
    name: '',
    categoryNo: '',
    price: '',
    salePrice: '',
    stock: '',
    images: [],
    description: '',
    expiredAt: '',
    keepImagesId: [], // ✅ 유지할 이미지 ID 리스트 추가
  })
  const [originalProduct, setOriginalProduct] = useState(null) // ✅ 기존 상품 데이터 저장
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await API.get(`item/${itemNo}`)
        const itemData = response.data.result.data

        const formattedProduct = {
          name: itemData.name,
          categoryNo: itemData.category?.categoryNo || '',
          price: itemData.price || '',
          salePrice: itemData.salePrice || '',
          stock: itemData.stock || '',
          images: itemData.images || [],
          description: itemData.description || '',
          expiredAt: itemData.expiredAt || '',
          keepImageIds: [],
        }
        console.log(itemData.images)
        itemData.images.forEach((img) => {
          formattedProduct.keepImageIds.push(img.imageNo)
        })

        console.log(formattedProduct)
        setProduct(formattedProduct)
        setOriginalProduct(formattedProduct) // ✅ 기존 데이터 저장
      } catch (error) {
        console.error('상품 데이터를 불러오는 데 실패했습니다.', error)
        alert('상품 데이터를 불러오는 데 실패했습니다.')
      }
    }

    fetchProductData()
  }, [itemNo])

  // ✅ 변경 여부 확인 함수
  const isProductChanged = () => {
    if (!originalProduct) return true
    return JSON.stringify(originalProduct) !== JSON.stringify(product)
  }

  // ✅ 이미지 삭제 핸들러 (keepImagesId에서 제거)
  const handleRemoveImage = (imageIndex) => {
    setProduct((prev) => {
      const newImages = [...prev.images]
      const removedImage = newImages[imageIndex]

      if (removedImage.imageNo) {
        // 기존 이미지라면 keepImagesId에서 제거
        const updatedKeepImageIds = prev.keepImageIds.filter((id) => id !== removedImage.imageNo)
        return {
          ...prev,
          images: newImages.filter((_, i) => i !== imageIndex),
          keepImageIds: updatedKeepImageIds,
        }
      }

      return { ...prev, images: newImages.filter((_, i) => i !== imageIndex) }
    })
  }

  // ✅ 폼 제출 핸들러 (상품 수정)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!localStorage.getItem('access_token')) {
      alert('상품 수정에 대한 인증이 필요합니다.');
      return;
    }
  
    if (
      !product.name ||
      !product.categoryNo ||
      !product.price ||
      !product.salePrice ||
      !product.stock ||
      !product.expiredAt ||
      !product.description
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
  
    if (!isProductChanged()) {
      alert('수정된 내용이 없습니다.');
      return;
    }
  
    try {
      const formData = new FormData();
  
      const itemData = {
        name: product.name,
        categoryNo: product.categoryNo,
        price: parseFloat(product.price),
        salePrice: parseFloat(product.salePrice),
        stock: parseInt(product.stock, 10),
        expiredAt: product.expiredAt,
        description: product.description,
        keepImageIds: product.keepImageIds,
      };
  
      formData.append('item', JSON.stringify(itemData));
  
      product.images.forEach((img) => {
        if (img.file) {
          formData.append('images', img.file);
        }
      });
  
      // ✅ FormData 내용 콘솔 확인
      console.log("=== FormData 출력 시작 ===");
      formData.forEach((value, key) => console.log(`${key}:`, value));
      console.log("item 데이터:", JSON.parse(formData.get('item')));
      formData.getAll('images').forEach((file, index) => {
        console.log(`이미지 ${index + 1}:`, file.name, file.size, file.type);
      });
      console.log("=== FormData 출력 끝 ===");
      console.log(itemNo);
      await API.put(`/item/${itemNo}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      alert('상품이 수정되었습니다!');
      navigate('/seller/products/search');
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };
  

  return (
    <div className='p-6'>
      <h1 className='font-bold text-[32px] mb-10'>상품 수정</h1>
      <form onSubmit={handleSubmit}>
        <ProductInfo product={product} setProduct={setProduct} />
        <ProductImage
          product={product}
          setProduct={setProduct}
          handleRemoveImage={handleRemoveImage}
        />
        <ProductDetails product={product} setProduct={setProduct} />
        <ProductDate product={product} setProduct={setProduct} />
        <button
          type='submit'
          className='mt-5 p-1 bg-lime-700 text-white border-black disabled:bg-gray-300'
          disabled={!isProductChanged()} // ✅ 변경된 내용 없으면 버튼 비활성화
        >
          상품 수정
        </button>
      </form>
    </div>
  )
}

export default EditProduct
