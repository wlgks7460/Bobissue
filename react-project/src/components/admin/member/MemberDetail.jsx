import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'
import { FaEdit, FaTrash } from 'react-icons/fa'
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
        navigate('/admin/members/info')
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
    <div className='p-6 flex '>
      <div className='max-w-xl w-full'>
        {/* Breadcrumb */}
        <Breadcrumb paths={breadcrumbPaths} />
        <h1 className='text-2xl font-bold mb-6'>회원 상세 정보</h1>

        {/* 정보 테이블 */}
        <table className='table-auto w-full border border-gray-300'>
          <tbody>
            <tr>
              <th className='border px-4 py-2 text-left bg-gray-100 w-1/3'>회원번호</th>
              <td className='border px-4 py-2'>{user.userNo}</td>
            </tr>
            <tr>
              <th className='border px-4 py-2 text-left bg-gray-100'>이름</th>
              <td className='border px-4 py-2'>
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
              </td>
            </tr>
            <tr>
              <th className='border px-4 py-2 text-left bg-gray-100'>이메일</th>
              <td className='border px-4 py-2'>
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
              </td>
            </tr>
            <tr>
              <th className='border px-4 py-2 text-left bg-gray-100'>전화번호</th>
              <td className='border px-4 py-2'>
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
              </td>
            </tr>
            <tr>
              <th className='border px-4 py-2 text-left bg-gray-100'>성별</th>
              <td className='border px-4 py-2'>
                {isEditing ? (
                  <select
                    name='gender'
                    value={formData.gender || ''}
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
              </td>
            </tr>
            <tr>
              <th className='border px-4 py-2 text-left bg-gray-100'>생년월일</th>
              <td className='border px-4 py-2'>
                {isEditing ? (
                  <input
                    type='date'
                    name='birthday'
                    value={formData.birthday || ''}
                    onChange={handleChange}
                    className='w-full border border-gray-300 rounded-md px-3 py-2'
                  />
                ) : (
                  formatDate(user.birthday)
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 버튼 */}
        <div className='mt-6 flex space-x-4'>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className='flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition'
              >
                <FaEdit />
                저장
              </button>
              <button
                onClick={handleDelete}
                className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition'
              >
                <FaTrash />
                회원 삭제
              </button>
              <button
                onClick={handleEditToggle}
                className='flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition'
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition'
            >
              <FaEdit />
              회원정보 수정
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberDetail
