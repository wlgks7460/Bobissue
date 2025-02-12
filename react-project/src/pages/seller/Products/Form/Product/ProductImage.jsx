import React from 'react'

const ProductImage = ({ product, setProduct }) => {
  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    const maxSize = 10 * 1024 * 1024 // 🔹 10MB 제한

    if (file) {
      // 🔹 파일 크기 제한 체크
      if (file.size > maxSize) {
        alert('파일 크기가 10MB를 초과할 수 없습니다.')
        return
      }

      // 🔹 이미지 중복 체크 (파일 자체 비교)
      const isDuplicate = product.images.some((img) => img.file?.name === file.name)

      if (isDuplicate) {
        alert('이미 업로드된 이미지입니다.')
        return
      }

      // 🔹 새 이미지 객체 생성
      const newImage = {
        imageNo: null,
        imageUrl: URL.createObjectURL(file),
        originalName: file.name,
        file: file,
      }

      // 🔹 기존 이미지 + 새 이미지 추가
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }))
    }
  }

  // 이미지 삭제 핸들러 (파일도 함께 삭제)
  const handleRemoveImage = (imageIndex) => {
    setProduct((prev) => {
      const newImages = prev.images.filter((_, index) => index !== imageIndex)

      // 메모리 누수 방지 (미리보기 URL 해제)
      URL.revokeObjectURL(prev.images[imageIndex].imageUrl)

      return { ...prev, images: newImages }
    })
  }

  return (
    <div className='mt-5 mb-5'>
      <h2 className='text-[16px] font-bold'>상품 이미지</h2>
      <div className='flex gap-4 mt-3 flex-wrap'>
        {/* 기존 및 새 이미지 렌더링 */}
        {product.images.map((image, index) => (
          <div key={index} className='relative w-48 h-48 border border-black'>
            <img
              src={image.imageUrl} // 파일을 미리보기 URL로 표시
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
        <label className='flex items-center justify-center w-48 h-48 border-2 border-dashed border-gray-400 cursor-pointer bg-gray-100 hover:bg-gray-200'>
          <span className='text-gray-500 text-xs'>클릭하여 업로드</span>
          <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
        </label>
      </div>
    </div>
  )
}

export default ProductImage
