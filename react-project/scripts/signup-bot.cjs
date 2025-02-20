const puppeteer = require('puppeteer')
const { faker } = require('@faker-js/faker')

// 회원가입 페이지 URL
const signupUrl = 'https://bobissue.store/signup'

// 랜덤 사용자 데이터 생성
const generateUserData = () => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(12, true, /[A-Za-z0-9@#%&*!]/),
    name: faker.person.fullName(),
    birthday: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
    phone: faker.phone.number('010-####-####'),
    gender: faker.helpers.arrayElement(['M', 'F']),
    height: faker.number.int({ min: 150, max: 200 }).toString(),
    weight: faker.number.int({ min: 45, max: 120 }).toString(),
  }
}

;(async () => {
  const userData = generateUserData() // 랜덤 유저 데이터 생성
  console.log('📌 생성된 유저 정보:', userData)

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(signupUrl, { waitUntil: 'networkidle2' })

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

  // 성별 선택 (라디오 버튼)
  if (userData.gender === 'M') {
    await page.click('input[id="male"]')
  } else {
    await page.click('input[id="female"]')
  }

  // 전체 동의 버튼 클릭 (모든 필수 약관 체크)
  await page.waitForSelector('button', { visible: true })
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const agreementButton = buttons.find((btn) => btn.textContent.includes('전체 동의'))
    if (agreementButton) agreementButton.click()
  })

  // 회원가입 버튼 클릭
  await page.click('input[type="submit"]')

  // 가입 처리 후 결과 대기
  //await page.waitForTimeout(5000)

  // 회원가입 성공 여부 확인 (alert 창 감지)
  page.on('dialog', async (dialog) => {
    console.log('📢 Alert 메시지:', dialog.message())
    await dialog.dismiss()
  })

  console.log('✅ 자동 회원가입 완료!')

  await browser.close()
})()
