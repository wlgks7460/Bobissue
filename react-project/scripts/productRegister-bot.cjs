const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

// 상품 등록 페이지 URL
const productRegisterUrl = 'https://bobissue.store/seller/products/register'

// 이미지 폴더 경로 설정
const imageFolder = path.join(require('os').homedir(), 'Desktop/images')

// 이미지 파일 목록 가져오기
const imageFiles = fs.readdirSync(imageFolder).filter((file) => file.match(/\.(jpg|png|jpeg)$/))

// Puppeteer 상품 등록 함수
const registerProduct = async (browser, image, index) => {
  console.log(`🔄 [${index + 1}/${imageFiles.length}] 상품 등록 진행 중...`)
  const page = await browser.newPage()
  await page.goto(productRegisterUrl, { waitUntil: 'networkidle2' })

  // 로그인 처리 (필요 시)
  try {
    await page.type('input[name="email"]', 'seller@naver.com')
    await page.type('input[name="password"]', '1234')
    await page.click('button[type="submit"]')
    await page.waitForNavigation()
  } catch (e) {
    console.log('로그인 단계 건너뜀 또는 오류 발생:', e)
  }

  const productName = path.parse(image).name
  const imagePath = path.join(imageFolder, image)

  // 로그인 처리 (필요 시)
  try {
    // 이메일 입력
    await page.waitForSelector('#email', { visible: true, timeout: 5000 })
    await page.type('#email', 'seller@naver.com')

    // 비밀번호 입력
    await page.waitForSelector('#password', { visible: true, timeout: 5000 })
    await page.type('#password', '1234')

    // 로그인 버튼 클릭
    await page.waitForSelector('button', { visible: true })
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach((btn) => {
        if (btn.innerText.includes('로그인')) {
          btn.click()
        }
      })
    })

    // 로그인 후 페이지 이동 대기
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
  } catch (e) {
    console.log('❌ 로그인 실패 또는 오류 발생:', e)
  }

  await page.close()
}

;(async () => {
  const browser = await puppeteer.launch({ headless: false }) // 브라우저 실행

  for (let i = 0; i < imageFiles.length; i++) {
    await registerProduct(browser, imageFiles[i], i)
    image
  }

  await browser.close() // 모든 작업 종료 후 브라우저 닫기
  console.log('🎉 모든 상품 등록이 완료되었습니다!')
})()
