import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/solid'
import DehazeIcon from '@mui/icons-material/Dehaze'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import API from '../../../utils/API'
import SearchBarCategory from './SearchBarCategory'
import { useDispatch } from 'react-redux'
import { categoryReducerActions } from '../../../redux/reducers/categorySlice'
import IconLink from './IconLink'

const SearchBar = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [categories, setCategories] = useState([]) // 카테고리 리스트

  const [searchKeyword, setSearchKeyword] = useState('') // 검색 키워드

  // 카테고리 show
  const [showCategory, setShowCategory] = useState(false)

  /** 검색 함수 */
  const searchProducts = (e) => {
    navigate(`/search?keyword=${searchKeyword}`)
    setSearchKeyword('')
  }

  useEffect(() => {
    API.get('/categories')
      .then((res) => {
        setCategories(res.data.result.data)
        dispatch(categoryReducerActions.setCategory({ categories: res.data.result.data }))
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])
  return (
    <div className='w-full border flex justify-center sticky z-10 -top-1 bg-[#F8F0E5] border-y-[#6F4E37]'>
      <div className='w-[70rem] flex justify-between items-center gap-3'>
        <div
          className='w-[150px] h-16 flex-none flex items-center gap-2 relative box-border'
          onMouseOver={() => setShowCategory(true)}
          onMouseOut={() => setShowCategory(false)}
        >
          <DehazeIcon className='text-[#6F4E37]' sx={{ fontSize: 30 }} />
          <p className='text-base text-[#6F4E37] py-2'>카테고리</p>
          {showCategory && (
            <div className='absolute top-16 left-0 flex flex-col w-[200px] h-[400px] border-x border-b border-gray-400 bg-[#F8F0E5] rounded-b'>
              {categories.map((v) => (
                <SearchBarCategory key={v.categoryNo} category={v} />
              ))}
            </div>
          )}
        </div>
        <div className='grow flex justify-center'>
          <div className='flex justify-between items-center px-3 w-[500px] h-[50px] border border-[#6F4E37] rounded bg-white'>
            <input
              type='text'
              className='w-[400px] bg-none focus:outline-none'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  searchProducts()
                }
              }}
            />
            {searchKeyword !== '' && (
              <button onClick={() => setSearchKeyword('')}>
                <XCircleIcon className='w-5 text-red-400' />
              </button>
            )}
            <button onClick={searchProducts}>
              <MagnifyingGlassIcon className='w-6' />
            </button>
          </div>
        </div>
        <div className='w-[150px] flex-none flex justify-end items-center gap-5'>
          <IconLink path={'/recipe'} tootip={'레시피 보기'} Icon={RestaurantMenuIcon} />
          <IconLink path={'/cart'} tootip={'장바구니 보기'} Icon={ShoppingBasketIcon} />
        </div>
      </div>
    </div>
  )
}

export default SearchBar
