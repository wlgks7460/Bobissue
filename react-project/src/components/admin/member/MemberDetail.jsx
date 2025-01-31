import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'

const MemberDetail = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원상세정보' }]

  const { userNo } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const formatDate = (dateString, forInput = false) => {
    if (!dateString) return ''
    const cleanedDate = dateString.replace(/[^0-9]/g, '')

    if (cleanedDate.length !== 8) return dateString

    const year = cleanedDate.slice(0, 4)
    const month = cleanedDate.slice(4, 6)
    const day = cleanedDate.slice(6, 8)

    return forInput ? `${year}-${month}-${day}` : `${year}년 ${month}월 ${day}일`
  }

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await API.get(`/users/${userNo}`)
        const userData = response.data.result.data

        const formattedData = {
          ...userData,
          birthday: formatDate(userData.birthday, true),
          gender: userData.gender || '', // 기본값을 ''로 설정하여 강제 'M' 방지
        }

        setUser(formattedData)
        setFormData(formattedData)
      } catch (error) {
        console.error('회원 상세 정보 조회 오류:', error.response || error.message)
        alert('회원 상세 정보를 가져오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserDetail()
  }, [userNo])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = async () => {
    try {
      const updatedData = {
        ...formData,
        birthday: formData.birthday.replace(/-/g, ''), // YYYY-MM-DD → YYYYMMDD 변환
      }

      await API.put(`/users/${userNo}`, updatedData)
      alert('회원 정보가 수정되었습니다.')
      setUser(updatedData)
      setIsEditing(false)
    } catch (error) {
      console.error('회원 수정 오류:', error.response || error.message)
      alert('회원 수정에 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      try {
        await API.delete(`/users/${userNo}`)
        alert('회원 삭제가 완료되었습니다.')
        navigate('/users')
      } catch (error) {
        console.error('회원 삭제 오류:', error.response || error.message)
        alert('회원 삭제에 실패했습니다.')
      }
    }
  }

  if (isLoading) {
    return <div className='p-6 text-center'>회원 정보를 불러오는 중...</div>
  }

  if (!user) {
    return <div className='p-6 text-center text-red-500'>회원 정보를 찾을 수 없습니다.</div>
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원 상세 정보</h1>
      <div className='space-y-4'>
        <p>
          <strong>회원번호:</strong> {user.userNo}
        </p>
        <p>
          <strong>이름: </strong>
          {isEditing ? (
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md px-3 py-2'
            />
          ) : (
            user.name
          )}
        </p>
        <p>
          <strong>이메일: </strong>
          {isEditing ? (
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md px-3 py-2'
            />
          ) : (
            user.email
          )}
        </p>
        <p>
          <strong>전화번호: </strong>
          {isEditing ? (
            <input
              type='text'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md px-3 py-2'
            />
          ) : (
            user.phoneNumber
          )}
        </p>
        <p>
          <strong>성별: </strong>
          {isEditing ? (
            <select
              name='gender'
              value={formData.gender || ''} // 기본값을 ''로 유지하여 강제 M 설정 방지
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md px-3 py-2'
            >
              <option value=''>성별 선택</option>
              <option value='M'>남성</option>
              <option value='F'>여성</option>
            </select>
          ) : user.gender === 'M' ? (
            '남성'
          ) : (
            '여성'
          )}
        </p>
        <p>
          <strong>생년월일: </strong>
          {isEditing ? (
            <input
              type='date'
              name='birthday'
              value={formData.birthday || ''} // 빈 값 허용하여 예외 방지
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md px-3 py-2'
            />
          ) : (
            formatDate(user.birthday)
          )}
        </p>
      </div>

      <div className='mt-6 flex space-x-4'>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 min-w-[80px]'
            >
              저장
            </button>
            <button
              onClick={handleEditToggle}
              className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 min-w-[80px]'
            >
              취소
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 min-w-[80px]'
          >
            수정
          </button>
        )}
        <button
          onClick={handleDelete}
          className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 min-w-[80px]'
        >
          삭제
        </button>
      </div>
    </div>
  )
}

export default MemberDetail
