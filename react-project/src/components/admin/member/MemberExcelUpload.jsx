import React, { useState } from 'react'
import ExcelJS from 'exceljs'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MemberExcelUpload = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원엑셀일괄등록' }]
  const [fileName, setFileName] = useState('')
  const [previewData, setPreviewData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // 한 페이지당 표시할 데이터 수

  // 템플릿 다운로드 핸들러
  const downloadTemplate = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('회원정보')

    worksheet.columns = [
      { header: '이름', key: 'name', width: 20 },
      { header: '생년월일(YYYYMMDD)', key: 'birthday', width: 15 },
      { header: '이메일', key: 'email', width: 25 },
      { header: '비밀번호', key: 'password', width: 20 },
      { header: '성별(M/F)', key: 'gender', width: 10 },
      { header: '키(cm)', key: 'height', width: 10 },
      { header: '몸무게(kg)', key: 'weight', width: 10 },
      { header: '전화번호', key: 'phoneNumber', width: 15 },
    ]

    worksheet.addRow({
      name: '홍길동',
      birthday: '19900101',
      email: 'hong@example.com',
      password: 'password123',
      gender: 'M',
      height: 175.5,
      weight: 70,
      phoneNumber: '010-1234-5678',
    })

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '회원등록_템플릿.xlsx'
      link.click()
      window.URL.revokeObjectURL(url)
    })
  }

  // 파일 업로드 핸들러
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name)

      const workbook = new ExcelJS.Workbook()
      const buffer = await file.arrayBuffer()
      await workbook.xlsx.load(buffer)

      const worksheet = workbook.worksheets[0]
      const rows = []
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) {
          const rowData = {
            name: row.getCell(1).value,
            birthday: row.getCell(2).value,
            email: row.getCell(3).value,
            password: row.getCell(4).value,
            gender: row.getCell(5).value,
            height: parseFloat(row.getCell(6).value),
            weight: parseFloat(row.getCell(7).value),
            phoneNumber: row.getCell(8).value,
          }
          rows.push(rowData)
        }
      })
      setPreviewData(rows)
      setCurrentPage(1) // 파일 업로드 시 첫 페이지로 초기화
    }
  }
  const handleSubmit = async () => {
    if (previewData.length === 0) {
      alert('업로드된 데이터가 없습니다.')
      return
    }

    try {
      const batchSize = 10 // 🔥 10명씩 배치 처리
      let successCount = 0
      let failedCount = 0
      let failedUsers = []

      for (let i = 0; i < previewData.length; i += batchSize) {
        const batch = previewData.slice(i, i + batchSize)

        try {
          await Promise.all(
            batch.map((data) =>
              API.post('/users/sign-up', {
                name: data.name,
                birthday: data.birthday.replace(/-/g, ''),
                email: data.email,
                password: data.password,
                gender: data.gender,
                height: data.height,
                weight: data.weight,
                phoneNumber: data.phoneNumber,
              }),
            ),
          )
          successCount += batch.length
        } catch (error) {
          console.error('회원 등록 오류:', error.response || error.message)
          failedCount += batch.length
          failedUsers.push(...batch.map((user) => user.email))
        }
      }

      alert(`회원 등록 완료: ${successCount}명\n등록 실패: ${failedCount}명`)
      if (failedCount > 0) {
        console.log('등록 실패한 회원 이메일 목록:', failedUsers)
      }
    } catch (error) {
      console.error('회원 등록 전체 오류:', error.response || error.message)
      alert('회원 등록 중 오류가 발생했습니다.')
    }
  }

  // 페이지네이션 관련 계산
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = previewData.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(previewData.length / itemsPerPage)

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원 엑셀 일괄등록</h1>

      <button
        onClick={downloadTemplate}
        className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 mb-4'
      >
        엑셀 파일 템플릿 다운로드
      </button>

      <div className='mb-6'>
        <input
          type='file'
          accept='.xlsx, .xls'
          onChange={handleFileUpload}
          className='border border-gray-300 p-2 rounded-md'
        />
        {fileName && <p className='mt-2 text-sm text-gray-600'>선택된 파일: {fileName}</p>}
      </div>

      {previewData.length > 0 && (
        <div className='mb-6'>
          <h1 className='text-lg font-semibold mb-4'>| 선택된 파일 회원 데이터</h1>
          <table className='table-auto w-full border border-gray-300'>
            <thead>
              <tr>
                <th className='border px-4 py-2'>이름</th>
                <th className='border px-4 py-2'>생년월일</th>
                <th className='border px-4 py-2'>이메일</th>
                <th className='border px-4 py-2'>성별</th>
                <th className='border px-4 py-2'>키</th>
                <th className='border px-4 py-2'>몸무게</th>
                <th className='border px-4 py-2'>전화번호</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((row, index) => (
                <tr key={index}>
                  <td className='border px-4 py-2 text-center'>{row.name}</td>
                  <td className='border px-4 py-2 text-center'>{row.birthday}</td>
                  <td className='border px-4 py-2 text-center'>{row.email}</td>
                  <td className='border px-4 py-2 text-center'>{row.gender}</td>
                  <td className='border px-4 py-2 text-center'>{row.height}</td>
                  <td className='border px-4 py-2 text-center'>{row.weight}</td>
                  <td className='border px-4 py-2 text-center'>{row.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 페이지네이션 버튼 (최대 5개만 표시) */}
          <div className='flex justify-center mt-4 space-x-2'>
            {/* 이전 페이지 버튼 */}
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className='px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300'
              >
                ◀
              </button>
            )}

            {/* 5개만 보여주는 페이지 버튼 */}
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => i + Math.max(1, currentPage - 2),
            )
              .filter((page) => page <= totalPages)
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}

            {/* 다음 페이지 버튼 */}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className='px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300'
              >
                ▶
              </button>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit} // 회원 등록 API 호출
        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
      >
        회원 등록
      </button>
    </div>
  )
}

export default MemberExcelUpload
