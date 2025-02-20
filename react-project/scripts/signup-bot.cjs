const puppeteer = require('puppeteer')

// 회원가입 페이지 URL
const signupUrl = 'https://bobissue.store/signup'

// 한국식 이름 리스트 (30개)
const koreanNames = [
  '민준',
  '서준',
  '예준',
  '도윤',
  '주원',
  '하준',
  '지호',
  '지훈',
  '준우',
  '현우',
  '우진',
  '지후',
  '성민',
  '승우',
  '태윤',
  '서진',
  '도현',
  '유준',
  '수현',
  '민호',
  '우빈',
  '정우',
  '준서',
  '건우',
  '승현',
  '영훈',
  '시우',
  '하람',
  '태민',
  '윤호',
  '정은',
  '일성',
  '정일',
  '미나',
  '진수',
  '가은',
  '정수',
  '정재',
  '정민',
  '동석',
  '무식',
  '민수',
]

// 랜덤 사용자 데이터 생성 함수

const generateUserData = (i) => {
  const randomNumber = Math.floor(10000 + i) // 랜덤 숫자 (1000~9999)
  const password = 'q1w2e3r4!' // 기본 비밀번호
  // 랜덤 숫자 추가

  // 랜덤 전화번호 (010-XXXX-YYYY)
  const randomMid = Math.floor(1000 + Math.random() * 9000)
  const randomEnd = Math.floor(1000 + Math.random() * 9000)
  const phone = `010-${randomMid}-${randomEnd}`

  // 성 + 이름 조합
  const lastNames = ['김', '이', '박', '최', '강', '차', '황황']
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const firstName = koreanNames[Math.floor(Math.random() * koreanNames.length)]

  return {
    email: `user${randomNumber}@test.com`,
    password: password,
    name: `${lastName}${firstName}`,
    birthday: new Date(
      Math.floor(Math.random() * (2006 - 1960 + 1) + 1960),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    )
      .toISOString()
      .split('T')[0],
    phone: phone,
    gender: Math.random() > 0.5 ? 'M' : 'F',
    height: (Math.floor(Math.random() * 51) + 150).toString(),
    weight: (Math.floor(Math.random() * 76) + 45).toString(),
  }
}

// Puppeteer 회원가입 함수
const signupProcess = async (browser, userData, index) => {
  console.log(`🔄 [${index + 1}/30] 회원가입 진행 중...`)
  const page = await browser.newPage()
  await page.goto(signupUrl, { waitUntil: 'networkidle2', timeout: 5000 })

  // 자동으로 입력
  await page.type('#email', userData.email)
  await page.type('#password', userData.password)
  await page.type('#password2', userData.password)
  await page.type('#name', userData.name)
  await page.type('#phone', userData.phone)
  await page.type('#height', userData.height)
  await page.type('#weight', userData.weight)

  // 생년월일 입력
  await page.evaluate((birth) => {
    document.querySelector('input[type="date"]').value = birth
  }, userData.birthday)

  // 성별 선택
  if (userData.gender === 'M') {
    await page.click('input[id="male"]')
  } else {
    await page.click('input[id="female"]')
  }

  // 전체 동의 버튼 클릭
  await page.waitForSelector('button, div, span', { visible: true, timeout: 5000 })

  const found = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, div, span'))
    const agreementContainer = elements.find((el) =>
      el.textContent.trim().includes('전체 동의합니다.'),
    )
    if (agreementContainer) {
      const agreementButton = agreementContainer.querySelector('button') || agreementContainer
      if (agreementButton) {
        agreementButton.click()
        return '✅ 전체 동의 버튼 클릭됨!'
      }
    }
    return '❌ 전체 동의 버튼을 찾을 수 없음!'
  })

  console.log(`🔍 [${index + 1}] ${found}`)

  // 회원가입 버튼 클릭
  await page.click('input[type="submit"]')

  // 가입 처리 후 결과 대기
  page.on('dialog', async (dialog) => {
    console.log(`📢 [${index + 1}] Alert 메시지:`, dialog.message())
    await dialog.dismiss()
  })

  console.log(`✅ [${index + 1}/300] 회원가입 완료!`)
  await page.close() // 페이지 닫기
}

;(async () => {
  const browser = await puppeteer.launch({ headless: false }) // 브라우저 실행

  for (let i = 0; i < 300; i++) {
    const userData = generateUserData(i) // 랜덤 유저 생성
    await signupProcess(browser, userData, i) // 회원가입 실행
  }

  await browser.close() // 모든 작업 종료 후 브라우저 닫기
  console.log('🎉 300명의 회원가입이 완료되었습니다!')
})()
