const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const comma ="·"
const productRegisterUrl = 'https://bobissue.store/seller/products/register'
const category1 = '샐러드·과일'
const category2 = '토핑샐러드'

// 이미지 폴더 경로 설정
const imageFolder = path.join(require('os').homedir(), `Desktop/images/${category1}/${category2}/`)
const imageFiles = fs.readdirSync(imageFolder).filter((file) => file.match(/\.(jpg|png|jpeg)$/))

console.log(imageFiles)

const getRandomPrice = () => Math.floor((Math.random() * (50000 - 5000)) / 100) * 100 + 5000
const getRandomStock = () => Math.floor(Math.random() * 91) + 10
const getRandomDiscountPrice = (price) => {
  return Math.floor((Math.random() * (price - 500 - 1000)) / 100) * 100 + 1000
}

// 오늘 날짜 이후 날짜 설정 (YYYY-MM-DD 문자열)
const getFutureDate = () => {
  let date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);
  return date.toISOString().split('T')[0]; 
};

// 상품 등록 함수
const registerProduct = async (browser, image, index) => {
  console.log(`🔄 [${index + 1}/${imageFiles.length}] 상품 등록 진행 중...`);

  const page = await browser.newPage();
  await page.goto(productRegisterUrl, { waitUntil: 'networkidle2' });

  // 로그인 처리
  try {
    await page.type('input[type="email"]', 'seller@naver.com');
    await page.type('input[type="password"]', '1234');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await page.goto(productRegisterUrl);
  } catch (e) {
    console.log('로그인 단계 건너뜀 또는 오류 발생:', e);
  }

  const productName = path.parse(image).name;
  const imagePath = path.join(imageFolder, image);
  const price = getRandomPrice();
  const discountPrice = getRandomDiscountPrice(price);
  const stock = getRandomStock();
  const expiredAt = getFutureDate();

  // 이미지 업로드
  const imageInput = await page.$('input[type="file"]');
  if (imageInput) {
    await imageInput.uploadFile(imagePath);
  }

  // 상품명 입력
  await page.type('input[type="text"]', productName);

  // ① 카테고리 드롭다운 클릭하여 열기
// ① 카테고리 드롭다운 클릭하여 열기
await page.waitForSelector('div[aria-haspopup="true"]', { visible: true });
await page.click('div[aria-haspopup="true"]');
await new Promise(resolve => setTimeout(resolve, 500));

// ② 대분류 카테고리 선택
await page.waitForSelector('.max-h-60.overflow-auto > div.p-3.cursor-pointer', { visible: true });
const mainCategories = await page.$$('.max-h-60.overflow-auto > div.p-3.cursor-pointer');
let mainFound = false;
for (let category of mainCategories) {
  const text = await page.evaluate(el => el.textContent.trim(), category);
  if (text.includes(category1)) {
    await category.click();
    console.log(`✅ 선택된 대분류 카테고리: ${text}`);
    mainFound = true;
    break;
  }
}
if (!mainFound) console.log('❌ 대분류 카테고리를 찾지 못했습니다.');

// ③ 하위 카테고리 선택 (대분류 선택 후 자동 표시됨)
await page.waitForSelector('.max-h-60.overflow-auto.bg-gray-50 > div.p-3.cursor-pointer', { visible: true });
const subCategories = await page.$$('.max-h-60.overflow-auto.bg-gray-50 > div.p-3.cursor-pointer');
let subFound = false;
for (let subCategory of subCategories) {
  const text = await page.evaluate(el => el.textContent.trim(), subCategory);
  if (text.includes(category2)) {
    await subCategory.click();
    console.log(`✅ 선택된 하위 카테고리: ${text}`);
    subFound = true;
    break;
  }
}
if (!subFound) console.log('❌ 하위 카테고리를 찾지 못했습니다.');

console.log(`✅ 카테고리 선택 완료: ${category1} > ${category2}`);


  // 가격 입력
  await page.type('input[placeholder="상품 가격 입력"]', price.toString());

  // 할인 가격 입력
  await page.type('input[placeholder="할인 가격 입력"]', discountPrice.toString());

  // 재고 수량 입력
  await page.type('input[placeholder="재고 수량 입력"]', stock.toString());

  // 설명 입력
  await page.type('textarea[placeholder="상품의 특징을 입력해주세요"]', `${productName}입니다.`);

  // ⑥ 판매 종료일 입력 및 선택 확정  
  // input[type="date"]에 값을 설정하고, input 및 change 이벤트를 발생시켜 선택 완료 처리
  await page.evaluate(async (dateValue) => {
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    dateInput.focus();  // 📌 포커스 설정 (React가 상태 업데이트를 감지하게 함)
    dateInput.value = dateValue;  // 📌 날짜 값 설정

    // 📌 React가 변경을 감지하도록 'input' 및 'change' 이벤트 발생
    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    dateInput.dispatchEvent(new Event('change', { bubbles: true }));

    // 📌 일부 UI는 키보드 이벤트가 필요할 수도 있음
    dateInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    dateInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    dateInput.blur(); // 📌 포커스 해제 (변경 확정)
  }
}, expiredAt);
console.log(`✅ 판매 종료일 입력 완료: ${expiredAt}`);

  

  // 폼 제출
  await page.click('button[type="submit"]');

  console.log(`✅ [${index + 1}] ${productName} 등록 완료`);
};

;(async () => {
  const browser = await puppeteer.launch({ headless: false })

  for (let i = 0; i < imageFiles.length; i++) {
    await registerProduct(browser, imageFiles[i], i)
  }

  console.log('🎉 모든 상품 등록이 완료되었습니다!')
  //await browser.close()
})()
