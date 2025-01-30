import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/SearchBar'
import API from '../../utils/API'
import CartItem from '../../components/consumer/cart/CartItem'
import CartSoldOut from '../../components/consumer/cart/CartSoldOut'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState([]) // 구매 가능 상품
  const [soldOut, setSoldOut] = useState([]) // 품절 상품
  const [totalPrice, setTotalPrice] = useState(0) // 총 원가
  const [totalSalePrice, setTotalSalePrice] = useState(0) // 총 구매가

  // 상품 가격 , 찍기
  const addComma = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // 총 가격 업데이트 함수
  const updateTotalPrice = (updatedItems) => {
    const { totalPrice, totalSalePrice } = updatedItems.reduce(
      (acc, item) => {
        acc.totalPrice += item.itemData.price * item.count
        acc.totalSalePrice += item.itemData.salePrice * item.count
        return acc
      },
      { totalPrice: 0, totalSalePrice: 0 },
    )

    setTotalPrice(totalPrice)
    setTotalSalePrice(totalSalePrice)
  }

  // 수량 변경 함수
  const updateItemCount = (itemNo, newCount) => {
    const updatedItems = items.map((item) =>
      item.itemData.itemNo === itemNo ? { ...item, count: newCount } : item,
    )

    setItems(updatedItems)
    updateTotalPrice(updatedItems)

    // localStorage 업데이트
    const cartData = JSON.parse(localStorage.getItem('cart')) || []
    const updatedCartData = cartData.map((item) =>
      item.itemNo === itemNo ? { ...item, count: newCount } : item,
    )
    localStorage.setItem('cart', JSON.stringify(updatedCartData))
  }

  // 상품 삭제 함수
  const removeItem = (itemNo) => {
    const updatedItems = items.filter((item) => item.itemData.itemNo !== itemNo)
    setItems(updatedItems)
    updateTotalPrice(updatedItems)

    // localStorage 업데이트
    const cartData = JSON.parse(localStorage.getItem('cart')) || []
    const updatedCartData = cartData.filter((item) => item.itemNo !== itemNo)
    localStorage.setItem('cart', JSON.stringify(updatedCartData))
  }

  // 데이터 불러오기
  useEffect(() => {
    const fetchCartItems = async () => {
      const cartData = JSON.parse(localStorage.getItem('cart')) || []

      const requests = cartData.map(async (v) => {
        try {
          const res = await API.get(`/item/${v.itemNo}`)
          const itemData = res.data.result.data
          return { itemData, count: v.count }
        } catch (err) {
          console.error(err)
          return null
        }
      })

      const results = await Promise.all(requests)

      const tempItems = []
      const tempSoldOut = []

      results.forEach((result) => {
        if (result) {
          if (result.itemData.stock >= result.count) {
            tempItems.push(result)
          } else {
            tempSoldOut.push(result)
          }
        }
      })

      setItems(tempItems)
      setSoldOut(tempSoldOut)
      updateTotalPrice(tempItems)
    }

    fetchCartItems()
  }, [])
  return (
    <div className='min-h-[75vh]'>
      <SearchBar />
      <div className='flex flex-col items-center my-10'>
        <h2 className='text-center text-2xl mb-10'>장바구니</h2>
        <div className='w-[60rem] flex gap-5 justify-between'>
          {/* 상품 관련 */}
          <div className='grow'>
            {items.length === 0 && soldOut.length === 0 ? '상품이 없습니다.' : ''}
            {/* 구매 가능 */}
            {items.length > 0 && (
              <div className='w-full border border-gray-400 rounded p-3'>
                <h3 className='text-lg mb-5'>구매 가능 상품</h3>
                {items.map((v) => (
                  <CartItem
                    key={v.itemData.itemNo}
                    item={v}
                    updateItemCount={updateItemCount}
                    removeItem={removeItem}
                  />
                ))}
              </div>
            )}
            {/* 구매 불가 */}
            {soldOut.length > 0 && (
              <div>
                <h3 className='text-lg mb-5'>구매 불가 상품</h3>
                {soldOut.map((v) => (
                  <CartSoldOut key={v.itemData.itemNo} item={v} />
                ))}
              </div>
            )}
          </div>
          {/* 결제 관련 */}
          <div className='w-[350px] border border-gray-400 rounded p-3'>
            <h3 className='text-lg mb-5'>결제 금액</h3>
            <div className='flex flex-col gap-3 mb-5'>
              <div className='flex justify-between'>
                <span>상품 금액</span> <span>{addComma(totalPrice)}원</span>
              </div>
              <div className='flex justify-between'>
                <span>할인 금액</span> <span>{addComma(totalSalePrice)}원</span>
              </div>
              <div className='flex justify-between'>
                <span>배송비</span> <span>{addComma(2500 * items.length)}원</span>
              </div>
            </div>
            <div className='flex justify-between mb-5'>
              <span>총 금액</span>{' '}
              <span>
                {addComma(totalSalePrice + 2500 * items.reduce((acc, cur) => acc + cur.count, 0))}원
              </span>
            </div>
            <button
              className='w-full h-[50px] rounded bg-indigo-400 text-white hover:bg-indigo-600'
              onClick={() => navigate('/payment')}
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
