import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBagIcon, Bars3Icon } from '@heroicons/react/24/solid'

const SearchBar = () => {
  const [categories, setCategories] = useState([])

  // 카테고리 show
  const [showCategory, setShowCategory] = useState(false)

  useEffect(() => {
    setCategories([
      { categoryNo: 0, name: '닭가슴살' },
      { categoryNo: 1, name: '포케' },
      { categoryNo: 2, name: '도시락' },
    ])
  }, [])
  return (
    <div className='w-full p-3 border flex justify-center sticky z-10 top-0 bg-slate-100'>
      <div
        className='w-[70rem] flex justify-between items-center gap-3'
        onMouseOver={() => setShowCategory(true)}
        onMouseOut={() => setShowCategory(false)}
      >
        <div className='w-[100px] flex-none flex items-center gap-2 relative'>
          <Bars3Icon className='w-6' />
          <span>카테고리</span>
          {showCategory && (
            <div className='absolute -bottom-[30px]'>
              {categories.map((v) => (
                <Link>{v.name}</Link>
              ))}
            </div>
          )}
        </div>
        <div className='grow flex justify-center'>
          <input type='text' className='w-[500px] h-[50px] border border-indigo-400 rounded' />
        </div>
        <div className='w-[100px] flex-none flex justify-end'>
          <Link to={'/cart'}>
            <ShoppingBagIcon className='w-5' />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
