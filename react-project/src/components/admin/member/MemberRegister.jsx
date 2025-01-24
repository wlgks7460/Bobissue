import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const MemberRegister = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '회원관리' }, // 회원관리
    { name: '회원관리' }, // 회원관리
    { name: '회원등록' }, // 현재 페이지
  ]

  // 입력폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    mobile: '',
    address: '',
    detailAddress: '',
    email: '',
    emailDomain: '',
  })

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // 주소 검색 팝업창 열기
  const openAddressPopup = () => {
    const popupWidth = 520 // 팝업 너비
    const popupHeight = 500 // 팝업 높이
    const popupX = window.screen.width / 2 - popupWidth / 2 // 화면 중앙정렬
    const popupY = window.screen.height / 2 - popupHeight / 2 // 화면 중앙정렬

    // 팝업 열기
    const popup = window.open(
      '',
      'addressPopup',
      `width=${popupWidth},height=${popupHeight},left=${popupX},top=${popupY},scrollbars=yes`,
    )

    // 팝업창 내용 구성 html
    popup.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>주소 검색</title>
        <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      </head>
      <body>
        <div id="postCodeContainer"></div>
        <script>
          const postCode = new daum.Postcode({
            oncomplete: function(data) {
              window.opener.postMessage(data, '*');
              window.close();
            }
          });
          postCode.embed(document.getElementById('postCodeContainer'), { width: '100%', height: '100%' });
        </script>
      </body>
      </html>
    `)
  }

  // 부모 창에서 메시지 수신
  window.addEventListener('message', (event) => {
    if (event.data.address) {
      setFormData({
        ...formData,
        address: event.data.address,
      })
    }
  })

  // 폼 제출 핸들러 -> 나중에 백엔드와 연동 예정
  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.') // 비밀번호 확인
      return
    }
    console.log('회원정보 제출:', formData) // 제출된 데이터 콘솔창 확인
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원 등록하기</h1>

      {/* 회원 등록 폼 */}
      <form onSubmit={handleSubmit}>
        {/* 사이트 이용정보 입력 */}
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-4'>사이트 이용정보</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium mb-1'>아이디</label>
              <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleChange}
                placeholder='아이디 입력'
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>비밀번호</label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='비밀번호 입력'
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>비밀번호 확인</label>
              <input
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='비밀번호 확인'
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
                required
              />
            </div>
          </div>
        </section>

        {/* 개인정보 입력 */}
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-4'>개인정보</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium mb-1'>이름</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='이름 입력'
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>휴대폰번호</label>
              <input
                type='tel'
                name='mobile'
                value={formData.mobile}
                onChange={handleChange}
                placeholder='휴대폰번호 입력'
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>전화번호</label>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='전화번호 입력'
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              />
            </div>
          </div>
        </section>

        {/* 주소 입력 */}
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-4'>주소 정보</h2>
          <div className='space-y-4'>
            <div className='flex items-center space-x-4'>
              <input
                type='text'
                name='address'
                value={formData.address}
                onChange={handleChange}
                placeholder='주소 검색을 클릭하세요'
                className='flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
                required
              />
              <button
                type='button'
                onClick={openAddressPopup}
                className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300'
              >
                주소 검색
              </button>
            </div>
            <input
              type='text'
              name='detailAddress'
              value={formData.detailAddress}
              onChange={handleChange}
              placeholder='상세 주소 입력'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            />
          </div>
        </section>

        {/* 제출 버튼 */}
        <div className='text-center'>
          <button
            type='submit'
            className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600'
          >
            회원 등록
          </button>
        </div>
      </form>
    </div>
  )
}

export default MemberRegister
