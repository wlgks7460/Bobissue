import React from 'react'

const ProductImage = ({ product, setProduct }) => {
  // 이미지 업로드 핸들러 (중복 방지)
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // 파일 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file)

      // 이미지 중복 체크 (기존 API 이미지와 새로 추가된 이미지 포함)
      const isDuplicate = product.images.some((img) => img.imageUrl === previewUrl)

      if (isDuplicate) {
        alert('이미 업로드된 이미지입니다.')
        return
      }

      // 새 이미지 객체 생성
      const newImage = {
        imageNo: null, // 새로 추가된 이미지이므로 ID 없음
        imageUrl: previewUrl, // 미리보기 URL 사용
        originalName: file.name, // 파일 원본 이름
        file: file, // 실제 파일 저장
      }

      // 기존 이미지 + 새 이미지 추가
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }))
    }
  }

  // 이미지 삭제 핸들러 (기존 이미지와 새 이미지 구분)
  const handleRemoveImage = (imageIndex) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex), // 선택한 이미지 제외
    }))
  }

  return (
    <div className='mt-5'>
      <h2 className='text-[16px] font-bold'>상품 이미지</h2>
      <div className='flex gap-4 mt-3 flex-wrap'>
        {/* 기존 및 새 이미지 렌더링 */}
        {product.images.map((image, index) => (
          <div key={index} className='relative w-24 h-24 border border-black'>
            <img
              src={image.imageUrl} // 기존 이미지든 새 이미지든 모두 표시
              alt={image.originalName || `상품 이미지 ${index}`}
              className='w-full h-full object-cover'
            />
            <button
              type='button'
              className='absolute top-0 right-0 bg-red-500 text-white text-xs p-1'
              onClick={() => handleRemoveImage(index)}
            >
              삭제
            </button>
          </div>
        ))}

        {/* 이미지 업로드 버튼 */}
        <label className='flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-400 cursor-pointer bg-gray-100 hover:bg-gray-200'>
          <span className='text-gray-500 text-xs'>클릭하여 업로드</span>
          <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
        </label>
      </div>
    </div>
  )
}

export default ProductImage
