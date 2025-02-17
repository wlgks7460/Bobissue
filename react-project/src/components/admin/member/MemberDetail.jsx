import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'

const MemberDetail = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원상세정보' }]
  const { userNo } = useParams()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const cleanedDate = dateString.replace(/[^0-9]/g, '')
    if (cleanedDate.length !== 8) return dateString
    const year = cleanedDate.slice(0, 4)
    const month = cleanedDate.slice(4, 6)
    const day = cleanedDate.slice(6, 8)
    return `${year}년 ${month}월 ${day}일`
  }

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await API.get(`/users/${userNo}`)
        const userData = response.data.result.data
        setUser(userData)
      } catch (error) {
        console.error('회원 상세 정보 조회 오류:', error.response || error.message)
        alert('회원 상세 정보를 가져오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserDetail()
  }, [userNo])

  if (isLoading) {
    return <div className='p-6 text-center text-gray-600'>회원 정보를 불러오는 중...</div>
  }

  if (!user) {
    return <div className='p-6 text-center text-red-500'>회원 정보를 찾을 수 없습니다.</div>
  }

  return (
    <div className='p-6 flex flex-col'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원 상세 정보</h1>

      <table className='w-full max-w-xl table-auto border-collapse border border-[#4E342E] text-[#3E2723]'>
        <tbody>
          <tr className='bg-[#EFEBE9]'>
            <th className='border border-[#6D4C41] px-4 py-3 text-left'>회원번호</th>
            <td className='border border-[#6D4C41] px-4 py-3'>{user.userNo}</td>
          </tr>
          <tr className='bg-[#F5F5F5]'>
            <th className='border border-[#6D4C41] px-4 py-3 text-left'>이름</th>
            <td className='border border-[#6D4C41] px-4 py-3'>{user.name}</td>
          </tr>
          <tr className='bg-[#EFEBE9]'>
            <th className='border border-[#6D4C41] px-4 py-3 text-left'>이메일</th>
            <td className='border border-[#6D4C41] px-4 py-3'>{user.email}</td>
          </tr>
          <tr className='bg-[#F5F5F5]'>
            <th className='border border-[#6D4C41] px-4 py-3 text-left'>전화번호</th>
            <td className='border border-[#6D4C41] px-4 py-3'>{user.phoneNumber}</td>
          </tr>
          <tr className='bg-[#EFEBE9]'>
            <th className='border border-[#6D4C41] px-4 py-3 text-left'>성별</th>
            <td className='border border-[#6D4C41] px-4 py-3'>
              {user.gender === 'M' ? '남성' : '여성'}
            </td>
          </tr>
          <tr className='bg-[#F5F5F5]'>
            <th className='border border-[#6D4C41] px-4 py-3 text-left'>생년월일</th>
            <td className='border border-[#6D4C41] px-4 py-3'>{formatDate(user.birthday)}</td>
          </tr>
          <tr className='bg-[#EFEBE9]'>
            <th className='border border-[#6D4C41] px-4 py-3 text-left'>회원 등급</th>
            <td className='border border-[#6D4C41] px-4 py-3'>{user.grade}</td>
          </tr>
          <tr className='bg-[#F5F5F5]'>
            <th className='border border-[#6D4C41] px-4 py-3 text-left'>주소 ID</th>
            <td className='border border-[#6D4C41] px-4 py-3'>{user.baseAddress}</td>
          </tr>
          <tr className='bg-[#EFEBE9]'>
            <th className='border border-[#6D4C41] px-4 py-3 text-left'>계정 상태</th>
            <td className={`border border-[#6D4C41] px-4 py-3`}>
              {user.status === 'Y' ? '활성' : '비활성'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default MemberDetail
