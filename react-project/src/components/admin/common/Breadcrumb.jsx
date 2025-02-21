// 페이지마다 경로 표시를 위한 컴포넌트
// EX. HOME > 회원관리 > 회원정보관리
// 페이지마다 동일한 스타일 적용 가능한 컴포넌트

import React from 'react'

const Breadcrumb = ({ paths = [] }) => {
  return (
    <nav className='mb-4'>
      <ul className='flex space-x-1 text-sm text-gray-600'>
        {paths.map((path, index) => (
          <li key={index} className='flex items-center'>
            {index > 0 && <span className='mx-1 text-gray-400'>{'>'}</span>}
            <span>{path.name}</span>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Breadcrumb
