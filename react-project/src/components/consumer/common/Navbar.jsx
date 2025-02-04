import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { userReducerActions } from '../../../redux/reducers/userSlice'
import API from '../../../utils/API'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // 로그인 유무
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  // 로그아웃
  const logout = (e) => {
    e.preventDefault()
    API.post('/auths/logout')
      .then((res) => {
        dispatch(userReducerActions.logout())
        alert('로그아웃 되었습니다.')
        navigate('/login')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div className='w-full py-3 px-2 flex justify-between border-b'>
      <Link to='' className='text-3xl bobissue-logo'>
        밥이슈
      </Link>
      {/* 로그인 상태에 따라 변화 */}
      {isAuthenticated ? (
        <div className='flex items-center gap-3'>
          <Link to={'/mypage'}>마이페이지</Link>
          <button onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          <Link to='/login'>로그인</Link>
          <Link to='/signup'>회원가입</Link>
        </div>
      )}
    </div>
  )
}

export default Navbar
