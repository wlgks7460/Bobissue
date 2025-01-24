import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const MemberInfoManagement = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '회원관리' }, // 회원관리
    { name: '회원관리' }, // 회원관리
    { name: '회원정보관리' }, // 현재 페이지
  ]

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />

      <h1 className='text-2xl font-bold mb-6'>회원정보관리</h1>

      {/* 검색 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>

        {/* 검색어 */}
        <div className='flex items-center mb-4 space-x-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>검색어</label>
            <select className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'>
              <option>아이디</option>
              <option>회원명</option>
              <option>휴대폰</option>
              <option>이메일</option>
            </select>
          </div>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>검색 입력</label>
            <input
              type='text'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              placeholder='검색어를 입력하세요'
            />
          </div>
        </div>

        {/* 기간 검색 */}
        <div className='flex items-center mb-4 space-x-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>기간 검색</label>
            <select className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'>
              <option>가입날짜</option>
              <option>마지막 로그인</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>시작 날짜</label>
            <input
              type='date'
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
          <span className='text-gray-500'>~</span>
          <div>
            <label className='block text-sm font-medium mb-1'>종료 날짜</label>
            <input
              type='date'
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
        </div>

        {/* 레벨 검색 */}
        <div className='mb-4'>
          <h3 className='text-sm font-medium mb-2'>레벨 검색</h3>
          <div className='flex items-center space-x-4'>
            <label className='flex items-center space-x-2'>
              <input type='radio' name='level' defaultChecked />
              <span>전체</span>
            </label>
            <label className='flex items-center space-x-2'>
              <input type='radio' name='level' />
              <span>일반회원</span>
            </label>
            <label className='flex items-center space-x-2'>
              <input type='radio' name='level' />
              <span>우수회원</span>
            </label>
            <label className='flex items-center space-x-2'>
              <input type='radio' name='level' />
              <span>특별회원</span>
            </label>
            <label className='flex items-center space-x-2'>
              <input type='radio' name='level' />
              <span>판매자</span>
            </label>
          </div>
        </div>

        {/* 조회 버튼 */}
        <div>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
            조회
          </button>
        </div>
      </section>

      {/* 조회 결과 */}
      <section>
        <h2 className='text-lg font-semibold mb-4'>조회 결과</h2>
        <div className='w-full h-64 bg-gray-200 flex items-center justify-center'>
          <span className='text-gray-500'>조회 결과</span>
        </div>
      </section>
    </div>
  )
}

export default MemberInfoManagement
