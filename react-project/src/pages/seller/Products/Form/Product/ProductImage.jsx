import React from 'react'

const ProductImage = ({ product, handleRemoveImage, setProduct }) => {
  // 리사이징 함수: 최대 너비와 높이를 지정하여 비율에 맞게 축소
  const resizeImage = (file, maxWidth = 1024, maxHeight = 1024) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const { width, height } = img
          // 비율 유지하며 축소 (scale은 1보다 작거나 같음)
          const scale = Math.min(maxWidth / width, maxHeight / height, 1)
          const newWidth = width * scale
          const newHeight = height * scale

          const canvas = document.createElement('canvas')
          canvas.width = newWidth
          canvas.height = newHeight
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, newWidth, newHeight)

          // canvas를 Blob으로 변환 후 File 객체로 재생성
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: file.type })
              resolve(resizedFile)
            } else {
              reject(new Error('Canvas is empty'))
            }
          }, file.type)
        }
        img.onerror = (err) => reject(err)
      }
      reader.onerror = (err) => reject(err)
    })
  }

  // 이미지 업로드 핸들러
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    const maxSize = 1 * 1024 * 1024 // 🔹 10MB 제한

    if (file) {
      let finalFile = file
      // 🔹 파일 크기 제한 체크 및 리사이징
      if (file.size > maxSize) {
        try {
          finalFile = await resizeImage(file)
          console.log('리사이징 완료:', finalFile)
        } catch (error) {
          console.error('이미지 리사이징 실패:', error)
          return
        }
      }

      // 🔹 이미지 중복 체크 (파일 이름으로 비교)
      const isDuplicate = product.images.some(
        (img) => img.file?.name === finalFile.name
      )
      if (isDuplicate) {
        alert('이미 업로드된 이미지입니다.')
        return
      }

      // 🔹 새 이미지 객체 생성
      const newImage = {
        imageNo: null,
        imageUrl: URL.createObjectURL(finalFile),
        originalName: finalFile.name,
        file: finalFile,
      }

      // 🔹 기존 이미지 + 새 이미지 추가
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }))
    }
  }

  // 이미지 삭제 확인
  const confirmRemoveImage = (index) => {
    const confirmDelete = window.confirm('정말 이 이미지를 삭제하시겠습니까?')
    if (confirmDelete) {
      handleRemoveImage(index)
    }
  }

  return (
    <div className='mt-5 mb-5'>
      <h2 className='text-[16px] font-bold'>상품 이미지</h2>
      <div className='flex gap-4 mt-3 flex-wrap'>
        {/* 기존 및 새 이미지 렌더링 */}
        {product.images.map((image, index) => (
          <div
            key={index}
            className='relative w-48 h-48 border border-gray-300 rounded-md overflow-hidden'
          >
            <img
              src={image.imageUrl} // 파일을 미리보기 URL로 표시
              alt={image.originalName || `상품 이미지 ${index}`}
              className='w-full h-full object-cover'
            />
            <button
              type='button'
              className='absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-bl-md'
              onClick={() => confirmRemoveImage(index)}
            >
              삭제
            </button>
          </div>
        ))}

        {/* 이미지 업로드 버튼 */}
        <label className='flex items-center justify-center w-48 h-48 border-2 border-dashed border-gray-400 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md'>
          <span className='text-gray-500 text-xs'>클릭하여 업로드</span>
          <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
        </label>
      </div>
    </div>
  )
}

export default ProductImage
