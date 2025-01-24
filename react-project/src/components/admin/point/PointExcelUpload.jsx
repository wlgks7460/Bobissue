import React, { useState } from 'react'
import ExcelJS from 'exceljs'
import Breadcrumb from '../common/Breadcrumb'

const PointExcelUpload = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: '포인트관리' }, { name: '포인트엑셀일괄등록' }]

  // 파일 이름과 미리보기 데이터 상태 관리
  const [fileName, setFileName] = useState('')
  const [previewData, setPreviewData] = useState([])

  // 파일 업로드 핸들러
  const handleFileUpload = async (event) => {
    const file = event.target.files[0] // 업로드된 파일 가져오기
    if (file) {
      setFileName(file.name) // 파일 이름 상태에 저장

      // 엑셀 파일 읽기
      const workbook = new ExcelJS.Workbook()
      const buffer = await file.arrayBuffer() // 파일을 ArrayBuffer 형식으로 변환
      await workbook.xlsx.load(buffer) // 엑셀 데이터를 읽음

      // 첫 번째 시트 데이터 추출
      const worksheet = workbook.worksheets[0]
      const rows = []
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) {
          // 첫 번째 줄(헤더)은 제외하고 데이터만 가져오기
          rows.push(row.values.slice(1)) // 첫 번째 열 제거하고 데이터 배열로 저장
        }
      })
      setPreviewData(rows.slice(0, 10)) // 최대 10개의 행만 미리보기로 보여줌
    }
  }

  // 템플릿 다운로드 핸들러
  const downloadTemplate = () => {
    const workbook = new ExcelJS.Workbook() // 새 엑셀 파일 생성
    const worksheet = workbook.addWorksheet('포인트정보') // 새로운 시트 생성

    // 컬럼 정의
    worksheet.columns = [
      { header: '아이디', key: '아이디', width: 20 },
      { header: '지급 포인트', key: '지급포인트', width: 15 },
    ]

    // 예시 데이터 추가
    worksheet.addRow(['example_user', '1000'])

    // 파일 다운로드
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '포인트등록_템플릿.xlsx'
      link.click()
      window.URL.revokeObjectURL(url)
    })
  }

  // 데이터 제출 핸들러
  const handleSubmit = () => {
    if (previewData.length === 0) {
      alert('업로드된 데이터가 없습니다.')
      return
    }
    console.log('전송할 데이터:', previewData)
    alert('데이터가 성공적으로 전송되었습니다.')
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>포인트 엑셀 일괄 등록</h1>

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

      {/* 미리보기 테이블 */}
      {previewData.length > 0 && (
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>미리보기</h3>
          <table className='table-auto w-full border border-gray-300'>
            <thead>
              <tr>
                <th className='border px-4 py-2'>아이디</th>
                <th className='border px-4 py-2'>지급 포인트</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className='border px-4 py-2'>
                      {cell}
                    </td>
                  ))}
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

export default PointExcelUpload
