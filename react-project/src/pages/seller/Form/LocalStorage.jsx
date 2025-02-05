// ✅ 데이터 저장 함수 (만료 시간 설정)
export function setItemWithExpiry(key, value, expiryInMinutes) {
  const now = new Date()
  const item = {
    value: value,
    expires: now.getTime() + expiryInMinutes * 60 * 1000,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

// ✅ 데이터 가져오는 함수 (만료 확인 후 자동 삭제)
export function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) return null

  const item = JSON.parse(itemStr)
  const now = new Date()

  if (now.getTime() > item.expires) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}
