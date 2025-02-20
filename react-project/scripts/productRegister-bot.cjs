const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const productRegisterUrl = 'https://bobissue.store/seller/products/register'
const category1 = '김밥·도시락·볶음밥'
const category2 = '김밥'

// 이미지 폴더 경로 설정
const imageFolder = path.join(require('os').homedir(), `Desktop/images/${category1}/${category2}/`)
const imageFiles = fs.readdirSync(imageFolder).filter((file) => file.match(/\.(jpg|png|jpeg)$/))

console.log(imageFiles)

const getRandomPrice = () => Math.floor((Math.random() * (50000 - 5000)) / 100) * 100 + 5000
const getRandomStock = () => Math.floor(Math.random() * 91) + 10
const getRandomDiscountPrice = (price) => {
  return Math.floor((Math.random() * (price - 500 - 1000)) / 100) * 100 + 1000
}

// 오늘 날짜 이후 날짜 설정
const getFutureDate = () => {
  let date = new Date()
  date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1)
  return date.toISOString().split('T')[0]
}

// 상품 등록 함수
const registerProduct = async (browser, image, index) => {
  console.log(`🔄 [${index + 1}/${imageFiles.length}] 상품 등록 진행 중...`)

  const page = await browser.newPage()
  await page.goto(productRegisterUrl, { waitUntil: 'networkidle2' })

  // 로그인 처리
  try {
    await page.type('input[type="email"]', 'seller@naver.com')
    await page.type('input[type="password"]', '1234')
    await page.click('button[type="submit"]')
    await page.waitForNavigation()
    await page.goto(productRegisterUrl)
  } catch (e) {
    console.log('로그인 단계 건너뜀 또는 오류 발생:', e)
  }

  const productName = path.parse(image).name
  const imagePath = path.join(imageFolder, image)
  const price = getRandomPrice()
  const discountPrice = getRandomDiscountPrice(price)
  const stock = getRandomStock()
  const expiredAt = getFutureDate()

  // 이미지 업로드
  const imageInput = await page.$('input[type="file"]')
  if (imageInput) {
    await imageInput.uploadFile(imagePath)
  }

  // 상품명 입력
  await page.type('input[type="text"]', productName)

  // ✅ 1. 카테고리 선택 버튼 클릭하여 드롭다운 열기
  await page.waitForSelector('div[aria-haspopup="true"]', { visible: true })
  await page.click('div[aria-haspopup="true"]')

  // ✅ 2. 대분류 카테고리 선택 (카테고리 목록이 렌더링될 때까지 기다림)
  await page.waitForSelector('div.p-3.cursor-pointer', { visible: true })

  await page.evaluate((category1) => {
    const categoryElements = [...document.querySelectorAll('div.p-3.cursor-pointer')]
    const targetCategory = categoryElements.find((el) => el.textContent.includes(category1))
    if (targetCategory) {
      targetCategory.click()
    }
  }, category1)

  // ✅ 3. 하위 카테고리 선택을 위해 다시 드롭다운 열기
  await page.waitForTimeout(500) // UI 렌더링 대기
  await page.click('div[aria-haspopup="true"]')

  // ✅ 4. 하위 카테고리 선택
  await page.waitForSelector('div.p-3.cursor-pointer', { visible: true })

  await page.evaluate((category2) => {
    const subCategoryElements = [...document.querySelectorAll('div.p-3.cursor-pointer')]
    const targetSubCategory = subCategoryElements.find((el) => el.textContent.includes(category2))
    if (targetSubCategory) {
      targetSubCategory.click()
    }
  }, category2)

  console.log(`✅ 카테고리 선택 완료: ${category1} > ${category2}`)

  // 가격 입력
  await page.type('input[placeholder="상품 가격 입력"]', price.toString())

  // 할인 가격 입력
  await page.type('input[placeholder="할인 가격 입력"]', discountPrice.toString())

  // 재고 수량 입력
  await page.type('input[placeholder="재고 수량 입력"]', stock.toString())

  // 설명 입력
  await page.type('textarea[placeholder="상품의 특징을 입력해주세요"]', `${productName}입니다.`)

  // 판매 종료일 입력
  await page.type('input[type="date"]', expiredAt)

  // 폼 제출
  await page.click('button[type="submit"]')

  console.log(`✅ [${index + 1}] ${productName} 등록 완료`)
  await page.waitForTimeout(2000)
  await page.close()
}

;(async () => {
  const browser = await puppeteer.launch({ headless: false })

  for (let i = 0; i < imageFiles.length; i++) {
    await registerProduct(browser, imageFiles[i], i)
  }

  console.log('🎉 모든 상품 등록이 완료되었습니다!')
  await browser.close()
})()
