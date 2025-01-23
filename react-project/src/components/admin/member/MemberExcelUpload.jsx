import React, { useState } from 'react'
import ExcelJS from 'exceljs'
import Breadcrumb from '../common/Breadcrumb'

const MemberExcelUpload = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '회원관리' }, // 회원관리
    { name: '회원관리' }, // 회원관리
    { name: '회원엑셀일괄등록' }, // 현재 페이지
  ]
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
      const buffer = await file.arrayBuffer() // 파일을  ArrayBuffer 형식으로 변환
      await workbook.xlsx.load(buffer) // 엑셀 데이터를 읽음

      // 첫 번째 시트 데이터 추출
      const worksheet = workbook.worksheets[0] // 첫번째 시트 선택
      const rows = []
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) {
          // 첫 번째 줄(헤더)은 제외하고 데이터만 가져오기
          rows.push(row.values.slice(1)) // 첫번째 열 제거하고 데이터 배열로 저장
        }
      })
      setPreviewData(rows.slice(0, 10)) // 최대 10개의 행만 미리보기로 보여줌 -> 추후 모달창 등으로 전체 리스트 확인 가능하도록 수정 가능
    }
  }

  //템플릿 다운로드 핸들러
  const downloadTemplate = () => {
    const workbook = new ExcelJS.Workbook() // 새 엑셀 파일 생성
    const worksheet = workbook.addWorksheet('회원정보') // 새로운 시트 생성

    // 컬럼 정의 -> 추후에 백엔드 저장 형식 확인하고 변경
    worksheet.columns = [
      { header: '번호', key: '번호', width: 10 },
      { header: '이름', key: '이름', width: 20 },
      { header: '전화번호', key: '전화번호', width: 15 },
      { header: '이메일', key: '이메일', width: 25 },
    ]

    // 예시 데이터 추가 -> 마찬가지로 컬럼 변경시 동시에 변경해야함
    worksheet.addRow(['1', '홍길동', '010-1234-5678', 'hong@example.com'])

    // 파일 다운로드
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' }) // Blob 객체 생성
      const url = window.URL.createObjectURL(blob) // Blob 객체를 URL로 변환
      const link = document.createElement('a') // 다운로드 링크 생성
      link.href = url
      link.download = '회원등록_템플릿.xlsx' // 다운로드 파일 이름 지정
      link.click() // 링크 클릭하여 다운로드 실행
      window.URL.revokeObjectURL(url) // URL 메모리 해제
    })
  }
  // 데이터 제출 핸들러
  const handleSubmit = () => {
    if (previewData.length === 0) {
      // 미리보기로 보여줄 데이터가 없을 경우 경고창
      alert('업로드된 데이터가 없습니다.')
      return
    }
    console.log('전송할 데이터:', previewData) // 전송할 데이터 콘솔 출력해서 확인
    alert('데이터가 성공적으로 전송되었습니다.')
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
          accept='.xlsx, .xls' // 업로드 가능한 파일 형식 지정
          onChange={handleFileUpload} // 파일 업로드 이벤트 핸들러
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
                <th className='border px-4 py-2'>번호</th>
                <th className='border px-4 py-2'>이름</th>
                <th className='border px-4 py-2'>전화번호</th>
                <th className='border px-4 py-2'>이메일</th>
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

export default MemberExcelUpload
