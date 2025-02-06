import React, { useEffect, useRef, useState } from 'react'
import { CheckCircleIcon as OutlineCheckCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as SolidCheckCircleIcon } from '@heroicons/react/24/solid'
import SignupTermsModal from '../../components/consumer/signup/SignupTermsModal'
import TermsOfService from '../../components/consumer/signup/TermsOfService'
import TermsOfPersonalData from '../../components/consumer/signup/TermsOfPersonalData'
import API from '../../utils/API'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()

  // 회원 가입 관련 데이터
  const emailRef = useRef() // 이메일
  const passwordRef = useRef() // 비밀번호
  const password2Ref = useRef() // 비밀번호 확인
  const nameRef = useRef() // 이름
  const birthRef = useRef() // 생년월일
  const [today, setToday] = useState() // 현재 날짜
  const phoneRef = useRef() // 전화번호
  const [gender, setGender] = useState('M') // 성별
  const heightRef = useRef() // 키
  const weightRef = useRef() // 몸무게

  // 동의 관련 데이터
  const [termsAgreement, setTermsAgreement] = useState(false) // 이용약관 동의
  const [personalDataAgreement, setPersonalDataAgreement] = useState(false) // 개인정보 동의
  const [emailAgreement, setEmailAgreement] = useState(false) // 이메일 수신 동의
  const [smsAgreement, setSmsAgreement] = useState(false) // sms 수신 동의
  const [ageAgreement, setAgeAgreement] = useState(false) // 만 14세 이상 확인

  // 약관 보기 상태
  const [termsBlock, setTermsBlock] = useState(false) // 이용약관
  const [personalDataBlock, setPersonalDataBlock] = useState(false) // 개인정보 약관

  // 성별 값 변경 함수
  const handleGender = (e) => {
    setGender(e.target.value)
  }

  // 약관 동의 관련 함수
  // 전체 동의
  const agreementAll = (e) => {
    e.preventDefault()
    if (termsAgreement && personalDataAgreement && emailAgreement && smsAgreement && ageAgreement) {
      setTermsAgreement(false)
      setPersonalDataAgreement(false)
      setEmailAgreement(false)
      setSmsAgreement(false)
      setAgeAgreement(false)
    } else {
      setTermsAgreement(true)
      setPersonalDataAgreement(true)
      setEmailAgreement(true)
      setSmsAgreement(true)
      setAgeAgreement(true)
    }
  }

  // 회원 가입 함수
  const signup = (e) => {
    e.preventDefault()
    // 비밀번호 검사 정규식(8-16/ 영문자, 숫자, 특수문자 각각 하나 이상)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/
    // 유효성 검사
    if (!emailRef.current.value.trim()) {
      alert('이메일을 확인해주세요.')
    } else if (
      !passwordRef.current.value.trim() ||
      passwordRef.current.value.trim() !== password2Ref.current.value ||
      !passwordRegex.test(passwordRef.current.value)
    ) {
      alert('비밀번호를 확인해주세요.')
    } else if (!nameRef.current.value.trim()) {
      alert('이름을 확인해주세요.')
    } else if (!phoneRef.current.value.trim()) {
      alert('전화번호를 확인해주세요.')
    } else if (!termsAgreement || !personalDataAgreement) {
      alert('약관에 동의해주세요.')
    } else {
      const payload = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
        name: nameRef.current.value,
        birthday: birthRef.current.value.split('-').join(''),
        phoneNumber: phoneRef.current.value,
        gender: gender,
        height: Number(heightRef.current.value) || 0.0,
        weight: Number(weightRef.current.value) || 0.0,
      }
      API.post('/users/sign-up', payload)
        .then((res) => {
          navigate('/login')
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
  // 현재 날짜 가져오기
  useEffect(() => {
    // mount
    const tempDate = new Date()
    const year = tempDate.getFullYear() - 14
    const month = `${tempDate.getMonth() + 1}`.padStart(2, '0')
    const date = tempDate.getDate().toString().padStart(2, '0')
    setToday(`${year}-${month}-${date}`)
    // unmount
    return () => {}
  }, [])
  return (
    <div className='min-h-[70vh] flex justify-center py-16'>
      <div className='flex flex-col'>
        <p className='text-2xl font-bold text-center mb-5'>회원가입</p>
        <p className='text-sm text-right mb-2'>
          <span className='text-red-600'>*</span>필수 입력사항
        </p>
        {/* 회원가입 폼 */}
        <form className='flex flex-col gap-5' onSubmit={signup}>
          {/* 이메일 */}
          <div className='flex items-center'>
            <label htmlFor='email' className='inline-block w-[150px] me-5'>
              이메일<span className='text-red-600'>*</span>
            </label>
            <input
              type='email'
              id='email'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
              placeholder='이메일을 입력해주세요.'
              ref={emailRef}
            />
          </div>
          {/* 비밀번호 */}
          <div className='flex items-center'>
            <label htmlFor='password' className='inline-block w-[150px] me-5'>
              비밀번호<span className='text-red-600'>*</span>
            </label>
            <div>
              <input
                type='password'
                id='password'
                className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
                placeholder='비밀번호를 입력해주세요.'
                ref={passwordRef}
              />
              <div className='text-sm text-gray-600 px-2'>
                <p>비밀번호는 최소 8자 이상, 최대 16자 이하입니다.</p>
                <p>영문자·숫자·특수문자를 각각 하나 이상을 포함해야합니다.</p>
              </div>
            </div>
          </div>
          <div className='flex items-center'>
            <label htmlFor='password2' className='inline-block w-[150px] me-5'>
              비밀번호확인<span className='text-red-600'>*</span>
            </label>
            <input
              type='password'
              id='password2'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
              placeholder='비밀번호를 한번 더 입력해주세요.'
              ref={password2Ref}
            />
          </div>
          {/* 이름 */}
          <div className='flex items-center'>
            <label htmlFor='name' className='inline-block w-[150px] me-5'>
              이름<span className='text-red-600'>*</span>
            </label>
            <input
              type='text'
              id='name'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
              placeholder='이름을 입력해주세요.'
              ref={nameRef}
            />
          </div>
          {/* 생년월일 */}
          <div className='flex items-center'>
            <p className='inline-block w-[150px] me-5'>
              생년월일<span className='text-red-600'>*</span>
            </p>
            <input
              type='date'
              min='1900-01-01'
              max={today}
              defaultValue={today}
              className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
              ref={birthRef}
            />
          </div>
          {/* 전화번호 */}
          <div className='flex items-center'>
            <label htmlFor='phone' className='inline-block w-[150px] me-5'>
              전화번호<span className='text-red-600'>*</span>
            </label>
            <input
              type='tel'
              pattern='[0-9]{3}-[0-9]{3,4}-[0-9]{4}'
              id='phone'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
              placeholder='-포함하여 입력해주세요.'
              ref={phoneRef}
            />
          </div>
          {/* 성별 */}
          <div className='flex items-center'>
            <p className='inline-block w-[150px] me-5'>
              성별<span className='text-red-600'>*</span>
            </p>
            <div className='grid grid-cols-2 w-[400px]'>
              <div className='flex items-center'>
                <input
                  type='radio'
                  id='male'
                  name='gender'
                  value='M'
                  className='w-5 h-5 me-5 accent-indigo-600'
                  onChange={handleGender}
                  defaultChecked
                />
                <label htmlFor='male'>남</label>
              </div>
              <div className='flex items-center'>
                <input
                  type='radio'
                  id='female'
                  name='gender'
                  value='F'
                  className='w-5 h-5 me-5 accent-indigo-600'
                  onChange={handleGender}
                />
                <label htmlFor='female'>여</label>
              </div>
            </div>
          </div>
          {/* 키 */}
          <div className='flex items-center'>
            <label htmlFor='height' className='inline-block w-[150px] me-5'>
              키
            </label>
            <input
              type='text'
              id='height'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
              placeholder='키(cm)를 입력해주세요.'
              pattern='^\d+(\.\d{1,2})?$'
              ref={heightRef}
            />
          </div>
          {/* 몸무게 */}
          <div className='flex items-center'>
            <label htmlFor='weight' className='inline-block w-[150px] me-5'>
              몸무게
            </label>
            <input
              type='text'
              id='weight'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
              placeholder='몸무게(kg)를 입력해주세요.'
              pattern='^\d+(\.\d{1,2})?$'
              ref={weightRef}
            />
          </div>
          <hr className='border-black' />
          {/* 약관 동의 */}
          <div className='flex mb-5'>
            <div className='w-[150px] me-5'>
              이용약관동의<span className='text-red-600'>*</span>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2'>
                <button onClick={agreementAll}>
                  {termsAgreement &&
                  personalDataAgreement &&
                  emailAgreement &&
                  smsAgreement &&
                  ageAgreement ? (
                    <SolidCheckCircleIcon className='w-8 text-indigo-600' />
                  ) : (
                    <OutlineCheckCircleIcon className='w-8 text-gray-600' />
                  )}
                </button>
                <div>
                  <p className='text-xl'>전체 동의합니다.</p>
                  <p className='text-xs text-gray-600'>
                    선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수
                    있습니다.
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setTermsAgreement(!termsAgreement)
                  }}
                >
                  {termsAgreement ? (
                    <SolidCheckCircleIcon className='w-8 text-indigo-600' />
                  ) : (
                    <OutlineCheckCircleIcon className='w-8 text-gray-600' />
                  )}
                </button>
                <div className='w-full flex justify-between'>
                  <p>
                    이용약관 동의 <span className='text-gray-500'>(필수)</span>
                  </p>
                  <button
                    className='text-indigo-600'
                    onClick={(e) => {
                      e.preventDefault()
                      setTermsBlock(!termsBlock)
                    }}
                  >
                    약관 보기
                  </button>
                  {termsBlock ? (
                    <SignupTermsModal
                      open={termsBlock}
                      setOpen={setTermsBlock}
                      title='이용약관 (필수)'
                      content={<TermsOfService />}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setPersonalDataAgreement(!personalDataAgreement)
                  }}
                >
                  {personalDataAgreement ? (
                    <SolidCheckCircleIcon className='w-8 text-indigo-600' />
                  ) : (
                    <OutlineCheckCircleIcon className='w-8 text-gray-600' />
                  )}
                </button>
                <div className='w-full flex justify-between'>
                  <p>
                    개인정보 수집·이용 동의 <span className='text-gray-500'>(필수)</span>
                  </p>
                  <button
                    className='text-indigo-600'
                    onClick={(e) => {
                      e.preventDefault()
                      setPersonalDataBlock(!personalDataBlock)
                    }}
                  >
                    약관 보기
                  </button>
                  {personalDataBlock ? (
                    <SignupTermsModal
                      open={personalDataBlock}
                      setOpen={setPersonalDataBlock}
                      title='개인정보 수집·이용 (필수)'
                      content={<TermsOfPersonalData />}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setEmailAgreement(!emailAgreement)
                  }}
                >
                  {emailAgreement ? (
                    <SolidCheckCircleIcon className='w-8 text-indigo-600' />
                  ) : (
                    <OutlineCheckCircleIcon className='w-8 text-gray-600' />
                  )}
                </button>
                <div className='w-full flex justify-between'>
                  <p>
                    이메일 수신 동의 <span className='text-gray-500'>(선택)</span>
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setSmsAgreement(!smsAgreement)
                  }}
                >
                  {smsAgreement ? (
                    <SolidCheckCircleIcon className='w-8 text-indigo-600' />
                  ) : (
                    <OutlineCheckCircleIcon className='w-8 text-gray-600' />
                  )}
                </button>
                <div className='w-full flex justify-between'>
                  <p>
                    SMS 수신 동의 <span className='text-gray-500'>(선택)</span>
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setAgeAgreement(!ageAgreement)
                  }}
                >
                  {ageAgreement ? (
                    <SolidCheckCircleIcon className='w-8 text-indigo-600' />
                  ) : (
                    <OutlineCheckCircleIcon className='w-8 text-gray-600' />
                  )}
                </button>
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
