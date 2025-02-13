import { useState } from 'react'
import { Link } from 'react-router-dom'

const IconLink = ({ path, tootip, Icon }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div className='relative'>
      <Link
        to={path}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Icon className='text-indigo-600' sx={{ fontSize: 30 }} />
        {showTooltip && (
          <div className='absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap'>
            {tootip}
          </div>
        )}
      </Link>
    </div>
  )
}

export default IconLink
