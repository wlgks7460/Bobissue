import React, { useEffect, useState } from 'react'
import ItemtoCartModal from '../common/ItemtoCartModal'
import { Link } from 'react-router-dom'
import itemDefaultImg from '../../../assets/consumer/itemDefault.webp'
import API from '../../../utils/API'
const HomeBestItemCard = ({ itemNo }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(false)
  }

  const handleMouseMove = () => {
    setIsDragging(true)
  }

  const handleClick = (e) => {
    if (isDragging) {
      e.preventDefault() // 드래그 상태일 때 링크 이동 방지
    }
  }

  // 이미지 컨테이너에 hovering 되어있는가
  const [isHovering, setIsHovering] = useState(false)
  // 상품 장바구니 담기 modal 상태
  const [isOpen, setIsOpen] = useState(false)

  const [item, setItem] = useState({})

  const getItem = () => {
    API.get(`/item/${itemNo}`)
      .then((res) => {
        setItem(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 상품 가격 , 찍기
  const addComma = (price) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return returnString
  }

  // 장바구니 담기 hover 관련 함수
  const handleMouseOver = () => {
    setIsHovering(true)
  }
  const handleMouseOut = () => {
    setIsHovering(false)
  }
  // 장바구니 담기 함수
  const itemOnCart = (e) => {
    e.preventDefault()
    setIsHovering(false)
    setIsOpen(true)
  }
  useEffect(() => {
    getItem()
  }, [])
  return (
    <div
      className='flex justify-center'
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    >
      <div className='w-[250px] flex flex-col gap-2'>
        {/* 상품 이미지 */}
        <div className='relative' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          <div className='border border-[#6F4E37] rounded'>
            <Link to={`/item/${item.itemNo}`} className='outline-none' onClick={handleClick}>
              <img
                // 이미지 경로 수정 필요
                src={item.images?.[0].imageUrl || itemDefaultImg}
                alt=''
                className='w-full h-[300px] border-none rounded '
                onError={(e) => {
                  e.target.src = itemDefaultImg
                }}
              />
            </Link>
          </div>
          {isHovering ? (
            <button
              className='w-full h-[50px] rounded-b absolute bottom-0 bg-black/40 text-white'
              onClick={itemOnCart}
            >
              장바구니 담기
            </button>
          ) : (
            ''
          )}
          {isOpen ? (
            <ItemtoCartModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              setIsHovering={setIsHovering}
              item={item}
            />
          ) : (
            ''
          )}
        </div>
        {/* 상품 정보 */}
        <div>
          <p className='text-lg font-semibold'>{item.name}</p> {/* 상품명 */}
          <div className='text-right'>
            {/* 원가 */}
            {item.price !== item.salePrice && (
              <p className='text-sm text-gray-400 line-through'>{addComma(item.price)}원</p>
            )}
            <p className='text-xl'>
              {/* 할인율 */}
              {item.price !== item.salePrice && (
                <span className='text-red-500 me-5'>
                  {Math.round(((item.price - item.salePrice) / item.price) * 100)}%
                </span>
              )}
              {/* 판매가 */}
              {addComma(item.salePrice)}원
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeBestItemCard
