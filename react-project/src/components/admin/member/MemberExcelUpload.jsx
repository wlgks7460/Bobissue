import React, { useState } from 'react'
import ExcelJS from 'exceljs'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MemberExcelUpload = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원엑셀일괄등록' }]
  const [fileName, setFileName] = useState('')
  const [previewData, setPreviewData] = useState([])
  const [errors, setErrors] = useState([])

  // 템플릿 다운로드 핸들러
  const downloadTemplate = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('회원정보')

    // 템플릿 컬럼 정의
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

    // 예시 데이터 추가
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
      setPreviewData(rows) // 전체 데이터 표시
    }
  }

  // 데이터 제출 핸들러 (배치 등록)
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
          failedUsers.push(...batch.map((user) => user.email)) // 실패한 이메일 저장
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

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원엑셀일괄등록</h1>

      {/* 템플릿 다운로드 버튼 */}
      <button
        onClick={downloadTemplate}
        className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 mb-4'
      >
        엑셀파일 템플릿 다운로드
      </button>

      {/* 파일 업로드 입력 */}
      <div className='mb-6'>
        <input
          type='file'
          accept='.xlsx, .xls'
          onChange={handleFileUpload}
          className='border border-gray-300 p-2 rounded-md'
        />
        {fileName && <p className='mt-2 text-sm text-gray-600'>선택된 파일: {fileName}</p>}
      </div>

      {/* 미리보기 테이블 (전체 데이터 표시) */}
      {previewData.length > 0 && (
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>미리보기 (전체 데이터 표시)</h3>
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
              {previewData.map((row, index) => (
                <tr key={index}>
                  <td className='border px-4 py-2'>{row.name}</td>
                  <td className='border px-4 py-2'>{row.birthday}</td>
                  <td className='border px-4 py-2'>{row.email}</td>
                  <td className='border px-4 py-2'>{row.gender}</td>
                  <td className='border px-4 py-2'>{row.height}</td>
                  <td className='border px-4 py-2'>{row.weight}</td>
                  <td className='border px-4 py-2'>{row.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
      >
        제출
      </button>
    </div>
  )
}

export default MemberExcelUpload
