import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SearchBarCategory = ({ category }) => {
  const navigate = useNavigate()
  const [showChildren, setShowChildren] = useState(false)

  return (
    <div
      className='mt-3 px-3'
      onMouseOver={() => setShowChildren(true)}
      onMouseOut={() => setShowChildren(false)}
    >
      <Link to={`/category/${category.categoryNo}`}>{category.name}</Link>
      {showChildren && (
        <div className='absolute top-0 left-full w-[200px] h-[400px] p-3 border-x border-b border-gray-400  bg-[#F8F0E5] rounded-b'>
          <div className='flex flex-col gap-3'>
            {category.children.map((v) => (
              <Link to={`/category/${category.categoryNo}/${v.categoryNo}`} key={v.categoryNo}>
                {v.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBarCategory
