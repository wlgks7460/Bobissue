import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const CategoryDetail = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '카테고리관리' }, { name: '카테고리상세' }]
  const { categoryNo } = useParams()
  const navigate = useNavigate()
  const [categoryDetail, setCategoryDetail] = useState(null)
  const [childCategories, setChildCategories] = useState([]) // 하위 카테고리 목록 상태
  const [itemDetails, setItemDetails] = useState([]) // 각 상품 상세 정보 배열
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 수정 모드 관련 상태 (중위 카테고리 수정: 카테고리명만)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({})

  // 하위 카테고리 수정 모드 상태
  const [editingChild, setEditingChild] = useState(null)
  const [editingChildName, setEditingChildName] = useState('')

  // 날짜 형식 변환 함수: "20250205 115529" → "2025-02-05 11:55:29"
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const cleaned = dateString.replace(/\s/g, '')
    if (cleaned.length === 14) {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}:${cleaned.substring(10, 12)}:${cleaned.substring(12, 14)}`
    } else if (cleaned.length >= 8) {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)}`
    }
    return dateString
  }

  // 중위(부모) 카테고리 상세 정보를 불러오고, 각 상품 상세 정보도 가져오는 함수
  const fetchDetail = async () => {
    setLoading(true)
    try {
      const response = await API.get(`/categories/${categoryNo}`)
      const catData = response.data.result.data
      setCategoryDetail(catData)
      console.log('Category Detail:', catData)

      // 만약 카테고리에 등록된 상품이 있다면, 각 상품의 상세 정보를 가져옴
      if (catData.items && catData.items.length > 0) {
        console.log('Fetching item details for each item in category...')
        const promises = catData.items.map((item) => {
          console.log(`Fetching details for itemNo: ${item.itemNo}`)
          return API.get(`/item/${item.itemNo}`)
        })
        const responses = await Promise.all(promises)
        const details = responses.map((resp) => resp.data.result.data)
        console.log('Fetched item details:', details)
        setItemDetails(details)
      }
    } catch (err) {
      console.error('카테고리 상세 정보를 불러오는 중 오류 발생:', err)
      setError('카테고리 정보를 불러오는 데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 전체 카테고리를 조회한 후, 현재 상세 페이지의 categoryNo와 일치하는 중위 카테고리를 찾아 그 하위 카테고리 목록으로 설정
  const fetchChildCategories = async () => {
    try {
      const response = await API.get('/categories')
      const allCategories = response.data.result.data
      const parentCategory = allCategories.find(
        (cat) => Number(cat.categoryNo) === Number(categoryNo),
      )
      if (parentCategory && parentCategory.children) {
        setChildCategories(parentCategory.children)
      } else {
        setChildCategories([])
      }
    } catch (err) {
      console.error('전체 카테고리 조회 중 오류 발생:', err)
    }
  }

  // 하위 카테고리 삭제 핸들러
  const handleChildDelete = async (childCategoryNo) => {
    if (window.confirm('해당 하위 카테고리를 삭제하시겠습니까?')) {
      try {
        await API.delete(`/categories/${childCategoryNo}`)
        alert('하위 카테고리가 삭제되었습니다.')
        await fetchChildCategories()
      } catch (err) {
        console.error('하위 카테고리 삭제 중 오류 발생:', err)
        alert('하위 카테고리 삭제에 실패했습니다.')
      }
    }
  }

  // 하위 카테고리 수정 토글 핸들러
  const handleChildEditToggle = (child) => {
    setEditingChild(child.categoryNo)
    setEditingChildName(child.name)
  }

  // 하위 카테고리 수정 저장 핸들러
  const handleChildEditSave = async (childCategoryNo) => {
    try {
      // 부모 번호는 수정하지 않으므로, 현재 상세 페이지의 중위 카테고리 번호 사용
      await API.put(`/categories/${childCategoryNo}`, {
        name: editingChildName,
        parentNo: categoryDetail.categoryNo,
      })
      alert('하위 카테고리가 수정되었습니다.')
      await fetchChildCategories()
      setEditingChild(null)
      setEditingChildName('')
    } catch (err) {
      console.error('하위 카테고리 수정 중 오류 발생:', err)
      alert('하위 카테고리 수정에 실패했습니다.')
    }
  }

  // 하위 카테고리 수정 취소 핸들러
  const handleChildEditCancel = () => {
    setEditingChild(null)
    setEditingChildName('')
  }

  useEffect(() => {
    fetchDetail()
    fetchChildCategories()
  }, [categoryNo])

  // 중위 카테고리 수정 모드 토글 핸들러 (카테고리명만)
  const handleEditToggle = () => {
    setEditData({
      name: categoryDetail.name || '',
    })
    setEditMode(true)
  }

  // 중위 카테고리 수정폼 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  // 중위 카테고리 수정 저장: 성공하면 최신 상세 정보와 하위 카테고리 목록 재조회
  const handleSave = async () => {
    try {
      await API.put(`/categories/${categoryNo}`, editData)
      alert('수정되었습니다.')
      await fetchDetail()
      await fetchChildCategories()
      setEditMode(false)
    } catch (err) {
      console.error('수정 중 오류 발생:', err)
      alert('수정에 실패했습니다.')
    }
  }

  // 중위 카테고리 수정 취소
  const handleCancel = () => {
    setEditMode(false)
  }

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await API.delete(`/categories/${categoryNo}`)
        alert('삭제되었습니다.')
        navigate('/admin/category')
      } catch (err) {
        console.error('삭제 중 오류 발생:', err)
        alert('삭제에 실패했습니다.')
      }
    }
  }

  if (loading) {
    return <div className='p-6'>로딩 중...</div>
  }

  if (error) {
    return <div className='p-6 text-red-500'>{error}</div>
  }

  if (!categoryDetail) {
    return null
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>카테고리 상세</h1>

      {/* 중위 카테고리 상세 정보 */}
      <div className='border p-4 rounded-lg mb-6 max-w-md'>
        <h2 className='text-xl font-semibold mb-4'>📁 {categoryDetail.name}</h2>
        <p>
          카테고리 번호: {categoryDetail.categoryNo}
          <br />
          카테고리 구분: 중위
        </p>
        {editMode ? (
          <>
            <div className='mt-2'>
              <label className='block font-normal'>카테고리명:</label>
              <input
                type='text'
                name='name'
                value={editData.name}
                onChange={handleChange}
                className='border border-gray-300 rounded-md px-3 py-1 w-full'
              />
            </div>
            <div className='mt-4 flex gap-4'>
              <button
                onClick={handleSave}
                className='bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded'
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                className='bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded'
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <p>카테고리명: {categoryDetail.name}</p>
            {categoryDetail.createdAt && <p>생성일: {formatDate(categoryDetail.createdAt)}</p>}
            <div className='mt-4 flex gap-4'>
              <button
                onClick={handleEditToggle}
                className='bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded'
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className='bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded'
              >
                삭제
              </button>
            </div>
          </>
        )}
      </div>

      {/* 상품(아이템) 목록 렌더링 (item 상세 조회 결과 사용, delYn === 'N'인 상품만) */}
      {itemDetails && itemDetails.filter((item) => item.delYn === 'N').length > 0 && (
        <div>
          <h2 className='text-lg font-semibold mb-4'>| 상품 목록</h2>
          <table className='w-full border border-gray-200 table-fixed'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-2 border'>상품 번호</th>
                <th className='px-4 py-2 border'>중위 카테고리</th>
                <th className='px-4 py-2 border'>하위 카테고리</th>
                <th className='px-4 py-2 border'>상품명</th>
                <th className='px-4 py-2 border'>가격</th>
              </tr>
            </thead>
            <tbody>
              {itemDetails
                .filter((item) => item.delYn === 'N')
                .map((item) => (
                  <tr key={item.itemNo} className='hover:bg-gray-50'>
                    <td className='px-4 py-2 border text-center'>{item.itemNo}</td>
                    <td className='px-4 py-2 border text-center'>
                      {item.category ? item.category.parentName : categoryDetail.name}
                    </td>
                    <td className='px-4 py-2 border text-center'>
                      {item.category && item.category.parentName ? item.category.name : '-'}
                    </td>
                    <td className='px-4 py-2 border text-center'>{item.name}</td>
                    <td className='px-4 py-2 border text-center'>{item.price}원</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 하위 카테고리 목록 렌더링 */}
      {childCategories && childCategories.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-lg font-semibold mb-4'>| 하위 카테고리 목록</h2>
          <table className='w-full border border-gray-200 table-fixed'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-2 border'>번호</th>
                <th className='px-4 py-2 border'>카테고리명</th>
                <th className='px-4 py-2 border'>생성일</th>
                <th className='px-4 py-2 border'>수정</th>
                <th className='px-4 py-2 border'>삭제</th>
              </tr>
            </thead>
            <tbody>
              {childCategories.map((child, index) => (
                <tr key={child.categoryNo} className='hover:bg-gray-50'>
                  <td className='px-4 py-2 border text-center'>{index + 1}</td>
                  <td className='px-4 py-2 border text-center'>
                    {editingChild === child.categoryNo ? (
                      <input
                        type='text'
                        value={editingChildName}
                        onChange={(e) => setEditingChildName(e.target.value)}
                        className='border border-gray-300 rounded-md px-2 py-1'
                      />
                    ) : (
                      child.name
                    )}
                  </td>
                  <td className='px-4 py-2 border text-center'>{formatDate(child.createdAt)}</td>
                  <td className='px-4 py-2 border text-center'>
                    {editingChild === child.categoryNo ? (
                      <>
                        <button
                          onClick={() => handleChildEditSave(child.categoryNo)}
                          className='bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded mr-2'
                        >
                          저장
                        </button>
                        <button
                          onClick={handleChildEditCancel}
                          className='bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded'
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleChildEditToggle(child)}
                        className='bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded'
                      >
                        수정
                      </button>
                    )}
                  </td>
                  <td className='px-4 py-2 border text-center'>
                    <button
                      onClick={() => handleChildDelete(child.categoryNo)}
                      className='bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded'
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CategoryDetail
