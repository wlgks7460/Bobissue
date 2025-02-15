import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import API from '../../utils/API'
import CartItem from '../../components/consumer/cart/CartItem'
import CartSoldOut from '../../components/consumer/cart/CartSoldOut'
import { Link, useNavigate } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useSelector } from 'react-redux'

const Cart = () => {
  const navigate = useNavigate()

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const loginStatus = useSelector((state) => state.user.status)

  const [items, setItems] = useState([]) // 구매 가능 상품
  const [soldOut, setSoldOut] = useState([]) // 품절 상품
  const [totalPrice, setTotalPrice] = useState(0) // 총 원가
  const [totalSalePrice, setTotalSalePrice] = useState(0) // 총 구매가
  const [deliveryFee, setDeliveryFee] = useState(3000) // 배송비

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
    if (totalSalePrice >= 50000) {
      setDeliveryFee(0)
    }
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
    const updatedSoldOut = soldOut.filter((item) => item.itemData.itemNo !== itemNo)
    setItems(updatedItems)
    setSoldOut(updatedSoldOut)
    updateTotalPrice(updatedItems)

    // localStorage 업데이트
    const cartData = JSON.parse(localStorage.getItem('cart')) || []
    const updatedCartData = cartData.filter((item) => item.itemNo !== itemNo)
    localStorage.setItem('cart', JSON.stringify(updatedCartData))
  }
  // 상품 전체 삭제
  const removeAll = () => {
    setItems([])
    setSoldOut([])
    localStorage.removeItem('cart')
  }

  // 결제 페이지 이동
  const goPayment = (e) => {
    e.preventDefault()
    if (soldOut.length > 0) {
      alert('구매 불가 상품을 제거해주세요.')
    } else if (items.length < 1) {
      alert('장바구니가 비었습니다.')
    } else {
      navigate('/payment')
    }
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
          <div className='grow flex flex-col gap-5'>
            {/* 장바구니에서 상품 삭제 */}
            <div className='w-full border border-gray-400 rounded p-3'>
              <button className='text-gray-600 hover:text-indigo-600' onClick={removeAll}>
                전체 삭제
              </button>
            </div>
            {items.length === 0 && soldOut.length === 0 && (
              <div className='flex flex-col gap-3 items-center'>
                <p className='text-center'>
                  <ExclamationCircleIcon className='w-20 text-gray-400' />
                </p>
                <p className='text-center text-xl text-gray-600'>장바구니가 비었습니다.</p>
              </div>
            )}
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
              <div className='w-full border border-gray-400 rounded p-3'>
                <h3 className='text-lg mb-5'>구매 불가 상품</h3>
                {soldOut.map((v) => (
                  <CartSoldOut key={v.itemData.itemNo} item={v} removeItem={removeItem} />
                ))}
              </div>
            )}
          </div>
          {/* 결제 관련 */}
          <div className='w-[350px] h-[300px] border border-gray-400 rounded p-3'>
            <h3 className='text-lg mb-5'>결제 금액</h3>
            <div className='flex flex-col gap-3 mb-5'>
              <div className='flex justify-between'>
                <span>상품 금액</span> <span>{addComma(totalPrice)}원</span>
              </div>
              <div className='flex justify-between'>
                <span>할인 금액</span> <span>{addComma(totalSalePrice)}원</span>
              </div>
              <div className='flex justify-between'>
                <span>배송비</span> <span>{addComma(deliveryFee)}원</span>
              </div>
            </div>
            <div className='flex justify-between mb-5'>
              <span>총 금액</span> <span>{addComma(totalSalePrice + deliveryFee)}원</span>
            </div>
            {!isAuthenticated && loginStatus !== 'consumer' ? (
              <Link to={'/login'}>
                <button className='w-full h-[50px] rounded bg-indigo-400 text-white hover:bg-indigo-600'>
                  로그인
                </button>
              </Link>
            ) : (
              <button
                className='w-full h-[50px] rounded bg-indigo-400 text-white hover:bg-indigo-600'
                onClick={goPayment}
              >
                구매하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
