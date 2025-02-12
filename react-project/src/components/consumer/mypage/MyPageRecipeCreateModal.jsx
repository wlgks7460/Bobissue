import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import API from '../../../utils/API'
import MyPageRecipeCreateModalCategory from './MyPageRecipeCreateModalCategory'
import MyPageRecipeCreateModalSelectedItem from './MyPageRecipeCreateModalSelectedItem'
import MyPageRecipeCreateModalItem from './MyPageRecipeCreateModalItem'

const MyPageRecipeCreateModal = ({ setShowModal, selectedItems, setSelectedItems }) => {
  const categories = useSelector((state) => state.category.categories)

  const [selectedCategory, setSelectedCategory] = useState(categories[0].categoryNo) // 불러올 상품 카테고리
  const [parentNo, setParentNo] = useState(categories[0].categoryNo)
  const [children, setChildren] = useState(categories[0].children) // 하위 카테고리 목록
  const [items, setItems] = useState({}) // 불러온 상품 정보

  // 카테고리별 상품 불러오기
  const getCategoryItem = (categoryNo) => {
    API.get(`/categories/${categoryNo}`)
      .then((res) => {
        setItems(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 상위 카테고리 핸들러
  const handleParent = (idx) => {
    setChildren(categories[idx].children)
    setParentNo(categories[idx].categoryNo)
    setSelectedCategory(categories[idx].categoryNo)
  }

  // 전체보기 핸들러
  const handleAll = () => {
    if (items.parentNo) {
      setSelectedCategory(items.parentNo)
    }
  }

  // 상품 선택 핸들러
  const handleSelectItem = (data) => {
    // 이미 선택된 상품이 있는지 확인
    const existingItem = selectedItems.find((item) => item.itemNo === data.itemNo)
    if (existingItem) {
      // 이미 선택된 상품이 있다면 수량만 증가
      setSelectedItems((prevItems) =>
        prevItems.map((item) =>
          item.itemNo === data.itemNo ? { ...item, count: item.count + 1 } : item,
        ),
      )
    } else {
      // 새로운 상품을 추가
      const temp = {
        itemNo: data.itemNo,
        data: data,
        count: 1,
      }
      setSelectedItems([...selectedItems, temp])
    }
  }

  useEffect(() => {
    // mount
    getCategoryItem(selectedCategory)
    // unmount
    return () => {}
  }, [selectedCategory])
  return (
    <div className='fixed top-0 left-0 z-50'>
      <div className='w-full h-full fixed bg-gray-600/80 flex justify-center items-center'>
        <div className='w-[600px] border border-gray-400 rounded bg-white p-5 flex flex-col'>
          <h3 className='text-lg text-center'>상품 선택하기</h3>
          {/* 모달 main */}
          <div className='w-full my-5 px-3'>
            {/* 상품 카테고리 */}
            <MyPageRecipeCreateModalCategory
              categories={categories}
              parentNo={parentNo}
              children={children}
              items={items}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleParent={handleParent}
              handleAll={handleAll}
            />
            {/* 선택된 상품 */}
            <div className='px-3 my-5'>
              <h3 className='mb-3 text-gray-500'>선택 상품</h3>
              <div className='overflow-y-auto max-h-[250px]'>
                {selectedItems.length > 0 ? (
                  <div>
                    {selectedItems.map((v) => (
                      <MyPageRecipeCreateModalSelectedItem
                        key={v.itemNo}
                        item={v}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                      />
                    ))}
                  </div>
                ) : (
                  <p className='text-center'>선택된 상품이 없습니다.</p>
                )}
              </div>
            </div>
            {/* 카테고리 별 상품 리스트 */}
            <div className='px-2 my-5'>
              <h3 className='mb-3 text-gray-500'>상품을 골라주세요.</h3>
              {items.items?.length === 0 && <p className='text-center'>상품이 준비 중입니다.</p>}
              <div className='w-full max-h-[200px] grid grid-cols-5 gap-y-2 overflow-y-auto'>
                {items.items?.map((v, i) => (
                  <MyPageRecipeCreateModalItem
                    key={v.itemNo}
                    item={v}
                    idx={i}
                    handleSelectItem={handleSelectItem}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* 모달 닫기 버튼 */}
          <div className='flex-none flex justify-center mt-2'>
            <button className='text-red-600' onClick={() => setShowModal(false)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPageRecipeCreateModal
