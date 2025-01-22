import React, { useRef } from 'react'

const Signup = () => {
  // 회원 가입 관련 데이터
  const emailRef = useRef() // 이메일
  const passwordRef = useRef() // 비밀번호
  const password2Ref = useRef() // 비밀번호 확인
  const nameRef = useRef() // 이름
  const birthRef = useRef() // 생년월일일
  const phoneRef = useRef() // 전화번호
  const postcodeRef = useRef() // 우편번호
  const addressRef = useRef() // 주소소
  const addressDetailRef = useRef() // 상세주소

  // 주소 찾기 함수
  const searchAddress = () => {
    new daum.Postcode({
      oncomplete: function (data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
        // 예제를 참고하여 다양한 활용법을 확인해 보세요.
        console.log(data)
      },
    }).open()
    addressDetailRef.current.focus()
  }

  // 회원 가입 함수
  const signup = (e) => {
    e.preventDefault()
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
  }
  return (
    <div className='min-h-[70vh] flex justify-center py-16'>
      <div className='flex flex-col'>
        <p className='text-2xl font-bold text-center mb-5'>회원가입</p>
        <p className='text-sm text-right mb-2'>
          <span className='text-red-600'>*</span>필수 입력사항
        </p>
        {/* 회원가입 폼 */}
        <form className='flex flex-col gap-5'>
          <div>
            <label htmlFor='email' className='inline-block w-[150px] me-5'>
              이메일<span className='text-red-600'>*</span>
            </label>
            <input
              type='email'
              id='email'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-5'
              placeholder='이메일을을 입력해주세요.'
            />
          </div>
          <div>
            <label htmlFor='password' className='inline-block w-[150px] me-5'>
              비밀번호<span className='text-red-600'>*</span>
            </label>
            <input
              type='password'
              id='password'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-5'
              placeholder='비밀번호를 입력해주세요.'
            />
          </div>
          <div>
            <label htmlFor='password2' className='inline-block w-[150px] me-5'>
              비밀번호확인<span className='text-red-600'>*</span>
            </label>
            <input
              type='password'
              id='password2'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-5'
              placeholder='비밀번호를 한번 더 입력해주세요.'
            />
          </div>
          <div>
            <label htmlFor='name' className='inline-block w-[150px] me-5'>
              이름<span className='text-red-600'>*</span>
            </label>
            <input
              type='text'
              id='name'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-5'
              placeholder='이름을 입력해주세요.'
            />
          </div>
          <div>
            <label htmlFor='phone' className='inline-block w-[150px] me-5'>
              전화번호<span className='text-red-600'>*</span>
            </label>
            <input
              type='tel'
              pattern='[0-9]{3}[0-9]{3,4}[0-9]{4}'
              id='phone'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-5'
              placeholder='-없이 입력해주세요.'
            />
          </div>
          <div className='flex'>
            <label htmlFor='postcode' className='inline-block w-[150px] me-5'>
              주소<span className='text-red-600'>*</span>
            </label>
            <div className='w-[400px]'>
              <div className='flex justify-between mb-2'>
                <input
                  type='text'
                  id='postcode'
                  className='w-[150px] h-[50px] border border-gray-400 rounded px-5'
                  onFocus={searchAddress}
                  placeholder='우편번호'
                />
                <input
                  type='text'
                  id='address'
                  className='w-[240px] h-[50px] border border-gray-400 rounded px-5'
                  onFocus={searchAddress}
                  placeholder='주소'
                />
              </div>
              <input
                type='text'
                id='addressDetail'
                className='w-[400px] h-[50px] border border-gray-400 rounded px-5'
                placeholder='상세 주소'
                ref={addressDetailRef}
              />
            </div>
          </div>
          <hr className='border-black' />
          {/* 약관 동의 */}
          <div className='flex mb-5'>
            <div className='w-[150px] me-5'>
              이용약관동의<span className='text-red-600'>*</span>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2 px-3'>
                <button className='w-[40px] h-[40px]'>체크</button>
                <div>
                  <p className='text-xl'>전체 동의합니다.</p>
                  <p className='text-xs text-gray-600'>
                    선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수
                    있습니다.
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2 px-3'>
                <button className='w-[40px] h-[40px]'>체크</button>
                <div className='w-full flex justify-between'>
                  <p>
                    이용약관 동의 <span className='text-gray-500'>(필수)</span>
                  </p>
                  <p className='text-indigo-600'>약관 보기</p>
                </div>
              </div>
              <div className='flex items-center gap-2 px-3'>
                <button className='w-[40px] h-[40px]'>체크</button>
                <div className='w-full flex justify-between'>
                  <p>
                    개인정보 수집·이용 동의 <span className='text-gray-500'>(필수)</span>
                  </p>
                  <p className='text-indigo-600'>약관 보기</p>
                </div>
              </div>
              <div className='flex items-center gap-2 px-3'>
                <button className='w-[40px] h-[40px]'>체크</button>
                <div className='w-full flex justify-between'>
                  <p>
                    이메일 수신 동의 <span className='text-gray-500'>(선택)</span>
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2 px-3'>
                <button className='w-[40px] h-[40px]'>체크</button>
                <div className='w-full flex justify-between'>
                  <p>
                    SMS 수신 동의 <span className='text-gray-500'>(선택)</span>
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2 px-3'>
                <button className='w-[40px] h-[40px]'>체크</button>
                <div className='w-full flex justify-between'>
                  <p>
                    본인은 만 14세 이상입니다. <span className='text-gray-500'>(필수)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 회원가입 제출 */}
          <input
            type='submit'
            value='회원가입'
            className='w-full h-[50px] border border-gray-400 rounded bg-indigo-400 hover:bg-indigo-600 text-white cursor-pointer'
          />
        </form>
      </div>
    </div>
  )
}

export default Signup
