import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const SellerTreeStructure = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자 관리' }, { name: '판매자 트리구조' }]

  // 예제 트리 데이터
  const treeData = [
    {
      id: 1,
      name: '대표자',
      username: 'admin',
      role: '대표자',
      phone: '010-0000-0000',
      joinDate: '2020-10-04',
      loginCount: 1451,
      children: [
        {
          id: 2,
          name: '관리자 1',
          username: 'manager1',
          role: '관리자 1',
          phone: '010-1111-1111',
          joinDate: '2020-10-05',
          loginCount: 878,
          children: [
            {
              id: 3,
              name: '관리자 2',
              username: 'manager2',
              role: '관리자 2',
              phone: '010-2222-2222',
              joinDate: '2020-10-06',
              loginCount: 754,
            },
          ],
        },
        {
          id: 4,
          name: '관리자 1-2',
          username: 'manager1-2',
          role: '관리자 1',
          phone: '010-3333-3333',
          joinDate: '2020-10-07',
          loginCount: 600,
        },
      ],
    },
  ]

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTree, setFilteredTree] = useState([])

  // 검색 핸들러
  const handleSearch = () => {
    const findTree = (nodes, term) => {
      for (const node of nodes) {
        if (node.name.includes(term) || node.username.includes(term)) {
          return node
        }
        if (node.children) {
          const result = findTree(node.children, term)
          if (result) return result
        }
      }
      return null
    }

    const result = findTree(treeData, searchTerm)
    setFilteredTree(result ? [result] : [])
  }

  // 역할별 이모티콘과 한글 이름 설정
  const getRoleIconAndName = (role) => {
    switch (role) {
      case '대표자':
        return { icon: '👑', name: '대표자' }
      case '관리자 1':
        return { icon: '🛠️', name: '관리자 1' }
      case '관리자 2':
        return { icon: '🔧', name: '관리자 2' }
      default:
        return { icon: '❓', name: '알 수 없음' }
    }
  }

  // 트리 렌더링 함수
  const renderTree = (nodes) => {
    return (
      <ul className='ml-4'>
        {nodes.map((node) => {
          const { icon, name } = getRoleIconAndName(node.role)
          return (
            <li key={node.id} className='mb-2'>
              <div className='p-2 border rounded bg-white mb-2 flex items-center space-x-2'>
                <span>{icon}</span>
                <span className='font-semibold'>{node.name}</span>
                <span className='text-gray-500'>({name})</span>
                <div className='text-sm text-gray-600'>
                  아이디: {node.username}, 휴대폰: {node.phone}, 가입일: {node.joinDate}, 로그인수:{' '}
                  {node.loginCount}
                </div>
              </div>
              {node.children && <div className='ml-6'>{renderTree(node.children)}</div>}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 트리구조</h1>

      {/* 검색 섹션 */}
      <div className='mb-6'>
        <label className='block text-sm font-medium mb-2'>대표 관리자 검색</label>
        <div className='flex space-x-2'>
          <input
            type='text'
            placeholder='관리자 이름 또는 ID를 입력하세요'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border rounded-md px-3 py-2 flex-grow'
          />
          <button
            onClick={handleSearch}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            검색
          </button>
        </div>
      </div>

      {/* 검색 결과 트리 */}
      <div className='border p-4 rounded-md bg-gray-50'>
        <h2 className='text-lg font-semibold mb-4'>검색 결과</h2>
        {filteredTree.length > 0 ? (
          renderTree(filteredTree)
        ) : (
          <p className='text-gray-500'>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  )
}

export default SellerTreeStructure
