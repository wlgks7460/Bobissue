import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import itemDefaultImg from '../../../assets/consumer/itemDefault.webp'

const HomeLiveShoppingItemProduct = ({ item }) => {
  const [itemData, setItemData] = useState({})
  const getItem = () => {
    API.get(`/item/${item?.itemNo}`)
      .then((res) => {
        setItemData(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    getItem()
  }, [])
  return (
    <div className='relative border border-[#6F4E37] rounded shadow-md'>
      {/* 상품 이미지 (이미지 src는 나중에 불러오기) */}
      <div className='w-[150px] h-[150px]  rounded'>
        <img
          src={itemData.images?.[0]?.imageUrl}
          alt=''
          className='w-[150px] h-[150px] rounded'
          onError={(e) => {
            e.target.src == itemDefaultImg
          }}
        />
      </div>

      {/* 툴팁: 상품 이름 */}
      <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/60 text-white text-xs rounded-md opacity-0 hover:opacity-100 transition-opacity'>
        {item.name}
      </div>
    </div>
  )
}

export default HomeLiveShoppingItemProduct
