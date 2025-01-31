import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBagIcon } from '@heroicons/react/24/solid'

const SearchBar = () => {
  return (
    <div className='w-full p-3 border flex justify-between sticky z-10 top-0 bg-slate-100'>
      <div>
        <p>카테고리</p>
      </div>
      <div>searchBar</div>
      <div className='flex'>
        <Link to={'/cart'}>
          <ShoppingBagIcon className='w-5' />
        </Link>
      </div>
    </div>
  )
}

export default SearchBar
