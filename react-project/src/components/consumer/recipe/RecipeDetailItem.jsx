import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import itemDefaultImg from '../../../assets/consumer/itemDefault.webp'

const RecipeDetailItem = ({ itemNo, cnt, selectedItem, setSelectedItem }) => {
  const [item, setItem] = useState({})

  const [itemActive, setItemActive] = useState(false)

  // 상품 핸들러
  const handleItem = () => {
    if (!itemActive) {
      setSelectedItem([...selectedItem, { item, cnt }])
    }
    setItemActive(!itemActive)
  }

  // 상품 데이터 불러오기
  const getItemData = () => {
    API.get(`/item/${itemNo}`)
      .then((res) => {
        setItem(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    // mount
    getItemData()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='flex flex-col gap-2'>
      <div
        className={`inline-block ${itemActive ? 'border-2 border-indigo-600' : 'border border-gray-400'} rounded`}
        onClick={handleItem}
      >
        <img
          src={item.images?.[0].imageUrl || itemDefaultImg}
          alt=''
          className='w-[150px] h-[150px] rounded'
          onError={(e) => {
            e.target.src = itemDefaultImg
          }}
        />
      </div>
      <p className='w-[150px] truncate'>{item.name}</p>
      <div className='flex items-center justify-end gap-3 px-1'>
        <span className='text-sm text-gray-400'>수량</span>
        <span>{cnt}개</span>
      </div>
    </div>
  )
}

export default RecipeDetailItem
