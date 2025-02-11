import React from 'react'

const Guide = () => {
  return (
    <div className='p-6 bg-white border border-gray-300 rounded-md shadow-md'>
      <h2 className='text-xl font-bold mb-4'>라이브 신청 가이드</h2>

      {/* 신청 가능 기간 */}
      <section className='mb-6'>
        <h3 className='text-lg font-semibold text-red-500'>신청 가능 기간</h3>
        <p className='text-gray-700 mt-2'>
          라이브 방송 신청은 매월 <strong>1일~14일</strong>까지만 가능합니다. 방송 날짜는{' '}
          <strong>다음 달부터</strong> 선택할 수 있습니다.
        </p>
      </section>

      {/* 신청 절차 */}
      <section className='mb-6'>
        <h3 className='text-lg font-semibold text-green-500'>라이브 신청 절차</h3>
        <p className='text-gray-700 mt-2'>아래 절차를 따라 라이브 방송을 신청하세요.</p>
        <ul className='list-disc pl-5 text-gray-700 mt-2'>
          <li>방송 제목과 설명을 입력합니다.</li>
          <li>방송 카테고리를 선택합니다.</li>
          <li>원하는 날짜와 시간을 선택합니다. (최대 1시간 연속 가능)</li>
          <li>라이브 신청 버튼을 클릭합니다.</li>
          <li>운영팀의 승인을 받은 후 방송을 진행할 수 있습니다.</li>
        </ul>
      </section>

      {/* 방송 유의사항 */}
      <section>
        <h3 className='text-lg font-semibold text-yellow-500'>라이브 방송 유의사항</h3>
        <p className='text-gray-700 mt-2'>방송 진행 전 아래 사항을 확인해주세요.</p>
        <ul className='list-disc pl-5 text-gray-700 mt-2'>
          <li>
            라이브 방송은 승인 후 최대 <strong>1시간</strong> 진행할 수 있습니다.
          </li>
          <li>방송 전 상품 소개 및 시연을 철저히 준비해주세요.</li>
          <li>방송이 원활하게 진행될 수 있도록 안정적인 인터넷 환경을 유지하세요.</li>
          <li>방송 중 문제가 발생할 경우 즉시 운영팀에 문의하세요.</li>
        </ul>
      </section>
    </div>
  )
}

export default Guide
