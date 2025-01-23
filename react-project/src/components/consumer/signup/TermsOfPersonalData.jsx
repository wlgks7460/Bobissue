import React from 'react'

const TermsOfPersonalData = () => {
  return (
    <div className='p-2'>
      <h2 className='font-bold'>제 1조 (목적)</h2>
      <ol className='list-inside list-decimal'>
        <li>
          이 약관은 회사가 제공하는 서비스와 관련하여 이용자의 개인정보를 보호하고 안전하게 관리하기
          위한 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </li>
      </ol>
      <hr className='my-2' />
      <h2 className='font-bold'>제 2조 (개인정보의 수집 항목 및 방법)</h2>
      <ol className='list-inside list-decimal'>
        <li>
          회사는 다음의 개인정보를 수집할 수 있습니다:
          <ul>
            <li>필수 항목: 성명, 이메일 주소, 연락처, 생년월일</li>
            <li>선택 항목: 주소, 결제 정보</li>
          </ul>
        </li>
        <li>개인정보는 이용자가 서비스 이용 시 동의한 범위 내에서 수집됩니다.</li>
      </ol>
      <hr className='my-2' />
      <h2 className='font-bold'>제 3조 (개인정보의 이용 목적)</h2>
      <ol className='list-inside list-decimal'>
        <li>
          회사는 수집한 개인정보를 다음의 목적을 위해 사용합니다:
          <ul>
            <li>서비스 제공 및 계약 이행</li>
            <li>고객 지원 및 문의 응대</li>
            <li>마케팅 및 프로모션</li>
            <li>서비스 개선 및 신규 서비스 개발</li>
          </ul>
        </li>
      </ol>
      <hr className='my-2' />
      <h2 className='font-bold'>제 4조 (개인정보의 보유 및 이용 기간)</h2>
      <ol className='list-inside list-decimal'>
        <li>
          회사는 이용자가 서비스를 이용하는 동안 개인정보를 보유 및 이용하며, 이용 종료 후에는 관련
          법령에 따라 보관이 필요한 경우를 제외하고 즉시 파기합니다.
        </li>
        <li>
          개인정보의 보유 기간은 다음과 같습니다:
          <ul>
            <li>회원가입 정보: 회원 탈퇴 시까지</li>
            <li>계약 및 결제 정보: 관련 법령에 따른 보관 기간</li>
          </ul>
        </li>
      </ol>
      <hr className='my-2' />
      <h2 className='font-bold'>제 5조 (개인정보의 제3자 제공)</h2>
      <ol className='list-inside list-decimal'>
        <li>
          회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는
          예외로 합니다:
          <ul>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 따라 제공이 요구되는 경우</li>
            <li>서비스 제공을 위해 필요한 최소한의 범위 내에서 제공하는 경우</li>
          </ul>
        </li>
      </ol>
      <hr className='my-2' />
      <h2 className='font-bold'>제 6조 (개인정보의 보호를 위한 조치)</h2>
      <ol className='list-inside list-decimal'>
        <li>
          회사는 개인정보를 안전하게 관리하기 위해 다음과 같은 조치를 취합니다:
          <ul>
            <li>개인정보 접근 제한 및 관리</li>
            <li>암호화 기술 적용</li>
            <li>개인정보 취급 직원의 최소화 및 교육</li>
          </ul>
        </li>
      </ol>
      <hr className='my-2' />
      <h2 className='font-bold'>제 7조 (이용자의 권리)</h2>
      <ol className='list-inside list-decimal'>
        <li>이용자는 언제든지 자신의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.</li>
        <li>회사는 이용자의 요청에 신속히 대응하며, 관련 법령에 따라 처리 결과를 안내합니다.</li>
      </ol>
      <hr className='my-2' />
      <h2 className='font-bold'>제 8조 (개인정보 파기 절차 및 방법)</h2>
      <ol className='list-inside list-decimal'>
        <li>
          회사는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우, 지체 없이 해당 정보를
          파기합니다.
        </li>
        <li>
          전자적 파일 형태의 정보는 복구 불가능한 방법으로 삭제하며, 문서 형태의 정보는 소각합니다.
        </li>
      </ol>
      <hr className='my-2' />
      <h2 className='font-bold'>제 9조 (문의처)</h2>
      <ol className='list-inside list-decimal'>
        <li>개인정보와 관련한 문의는 아래의 연락처로 가능합니다:</li>
        <ul>
          <li>담당자: 개인정보 보호 책임자</li>
          <li>이메일: privacy@company.com</li>
          <li>전화번호: 1234-5678</li>
        </ul>
      </ol>
    </div>
  )
}

export default TermsOfPersonalData
