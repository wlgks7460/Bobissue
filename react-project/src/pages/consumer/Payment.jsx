import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/API'
import PaymentAddressModal from '../../components/consumer/payment/PaymentAddressModal'
import SearchBar from '../../components/consumer/common/SearchBar'

const Payment = () => {
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState({})

  const [deliveryFee, setDeliveryFee] = useState(3000) // 배송비

  // 배송 정보 상태
  const [addressNo, setAddressNo] = useState()
  const [postcode, setPostCode] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [requests, setRequests] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState([])

  // 결제 방법 상태
  const [paymentMethod, setPaymentMethod] = useState('card')

  // 장바구니 상품 상태
  const [items, setItems] = useState([])
  const [totalSalePrice, setTotalSalePrice] = useState(0)

  // 포인트 및 쿠폰 상태
  const [availablePoints, setAvailablePoints] = useState(5000) // 예시값
  const [points, setPoints] = useState(0)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const availableCoupons = [
    { code: 'DISCOUNT10', discount: 5000, name: '5,000원 할인' },
    { code: 'DISCOUNT20', discount: 10000, name: '10,000원 할인' },
  ]

  const handlePointsChange = (e) => {
    const value = Math.min(Number(e.target.value), availablePoints)
    setPoints(value)
  }

  const handleCouponChange = (e) => {
    const coupon = availableCoupons.find((c) => c.code === e.target.value)
    setSelectedCoupon(coupon)
    setCouponDiscount(coupon ? coupon.discount : 0)
  }

  // 배송지 선택 함수
  const selectAddress = (addr) => {
    setAddressNo(addr.addressNo)
    setPostCode(addr.postalCode)
    setAddress(addr.address)
    setAddressDetail(addr.addressDetail)
    setShowModal(false)
  }

  // 상품 가격 포맷팅 함수
  const addComma = (price) => price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // 총 가격 업데이트
  const updateTotalPrice = (updatedItems) => {
    const total = updatedItems.reduce((acc, item) => acc + item.itemData.salePrice * item.count, 0)
    setTotalSalePrice(total)
    if (total >= 50000) {
      setDeliveryFee(0)
    }
  }

  // 결제 전 상품 체크
  const checkStock = () => {
    const payload = JSON.parse(localStorage.getItem('cart'))
    API.post('/payments/orderable', payload)
      .then((res) => {
        if (res.data.message.code === 'SUCCESS_ORDERABLE') {
          handlePayment()
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 결제 성공 후 주문 생성
  const createOrder = (payload) => {
    API.post('/orders', payload)
      .then((res) => {
        localStorage.removeItem('cart')
        navigate('/')
      })
      .catch((err) => {
        console.error(err)
      })
  }
  // 결제 취소 및 실패 시
  const cancelPayment = () => {
    const payload = JSON.parse(localStorage.getItem('cart'))
    API.post('/payments/cancel', payload)
      .then((res) => {})
      .catch((err) => {
        console.error(err)
      })
  }
  // 결제
  const handlePayment = () => {
    // 결제 정보 생성
    const paymentData = {
      userNo: userInfo.userNo,
      addressNo: addressNo,
      payment: paymentMethod.toUpperCase(),
      useCouponNo: selectedCoupon ? selectedCoupon.code : null,
      requests: requests || '부재시 경비실에 맡겨주세요.',
      items: items.map((item) => ({
        itemNo: item.itemData.itemNo,
        count: item.count,
      })),
      usePoint: points,
    }

    // 결제 함수
    callPayment(paymentData)
  }

  // 결제 함수
  const callPayment = (paymentData) => {
    const { IMP } = window
    IMP.init(import.meta.env.VITE_PORTONE_STORE_ID) // 가맹점 식별 코드

    // 결제 데이터 정의하기
    const data = {
      pg: 'html5_inicis.INIpayTest', // PG사
      pay_method: paymentMethod, // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: 100, // 테스트 금액
      name: 'bobissue 구매', // 주문명
      buyer_name: userInfo.name, // 구매자 이름
      buyer_tel: '010-1111-1111', // 구매자 전화번호
      buyer_email: userInfo.email, // 구매자 이메일
      buyer_addr: 'address', // 구매자 주소
      buyer_postcode: '00000', // 구매자 우편번호
    }
    IMP.request_pay(data, (res) => {
      const success = res.success
      if (success) {
        // 결제성공시 시행할 동작들
        alert('결제 성공')
        createOrder(paymentData)
      } else {
        // 결제 실패시 시행할 동작들
        alert('결제 실패')
        cancelPayment()
      }
    })
  }

  // 유저 정보 불러오기
  const getUserData = () => {
    API.get('/users/profile')
      .then((res) => {
        setUserInfo(res.data.result.data)
        getAddressData(res.data.result.data.userNo)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 배송지 불러오기
  const getAddressData = (userNo) => {
    const payload = {
      userNo: userNo,
    }
    if (payload.userNo) {
      API.post('/address/list', payload)
        .then((res) => {
          setSavedAddresses(res.data.result.data)
          getBaseAddressData()
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  // 기본 배송지 불러오기
  const getBaseAddressData = () => {
    API.get('/address/base')
      .then((res) => {
        const addr = res.data.result.data
        setAddressNo(addr.addressNo)
        setPostCode(addr.postalCode)
        setAddress(addr.address)
        setAddressDetail(addr.addressDetail)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 장바구니 데이터 불러오기
  useEffect(() => {
    const fetchCartItems = async () => {
      const cartData = JSON.parse(localStorage.getItem('cart')) || []
      const requests = cartData.map(async (v) => {
        try {
          const res = await API.get(`/item/${v.itemNo}`)
          return { itemData: res.data.result.data, count: v.count }
        } catch (err) {
          console.error(err)
          return null
        }
      })
      const results = await Promise.all(requests)
      const tempItems = results.filter((item) => item && item.itemData.stock >= item.count)
      setItems(tempItems)
      updateTotalPrice(tempItems)
    }
    fetchCartItems()
    getUserData()
  }, [])

  return (
    <div>
      <SearchBar />
      <div className='flex flex-col items-center py-10'>
        <h2 className='text-2xl font-semibold mb-6'>주문서</h2>
        <div className='w-full max-w-3xl bg-white border border-[#6F4E37] shadow-md p-6 rounded-lg'>
          {/* 배송 정보 */}
          <div className='border-b border-[#6F4E37] pb-6 mb-6'>
            <h3 className='text-lg font-semibold mb-4'>배송 정보</h3>
            <div className='mb-3'>
              <p>{address ? `[${postcode}] ${address}` : '배송지를 선택하세요'}</p>
              <p>{addressDetail && `${addressDetail}`}</p>
            </div>
            <button
              className='w-full p-2 border rounded mb-3 bg-gray-200'
              onClick={() => setShowModal(true)}
            >
              배송지 선택
            </button>
            <textarea
              placeholder={`배송 요청 사항\n(기본값) 부재시 경비실에 맡겨주세요.`}
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              className='w-full p-2 border border-[#6F4E37] rounded resize-none h-20'
            />
          </div>

          {/* 포인트 사용 */}
          <div className='border-b border-[#6F4E37] pb-6 mb-6'>
            <h3 className='text-lg font-semibold mb-4'>포인트 사용</h3>
            <p className='mb-2'>사용 가능 포인트: {availablePoints}P</p>
            <input
              type='number'
              placeholder='사용할 포인트 입력'
              value={points}
              onChange={handlePointsChange}
              className='w-full p-2 border border-[#6F4E37] rounded'
              max={availablePoints}
            />
          </div>

          {/* 쿠폰 선택 */}
          <div className='border-b border-[#6F4E37] pb-6 mb-6'>
            <h3 className='text-lg font-semibold mb-4'>쿠폰 선택</h3>
            <select
              value={selectedCoupon?.code || ''}
              onChange={handleCouponChange}
              className='w-full p-2 border border-[#6F4E37] rounded'
            >
              <option value=''>쿠폰을 선택하세요</option>
              {availableCoupons.map((coupon) => (
                <option key={coupon.code} value={coupon.code}>
                  {coupon.name}
                </option>
              ))}
            </select>
          </div>

          {/* 결제 금액 */}
          <div className='border-b border-[#6F4E37] pb-6 mb-6'>
            <h3 className='text-lg font-semibold mb-4'>결제 금액</h3>
            <div className='flex justify-between'>
              <span>총 상품 금액</span>
              <span>{addComma(totalSalePrice)}원</span>
            </div>
            <div className='flex justify-between'>
              <span>배송비</span>
              <span>{addComma(deliveryFee)}원</span>
            </div>
            <div className='flex justify-between text-red-500'>
              <span>쿠폰 할인</span>
              <span>-{addComma(couponDiscount)}원</span>
            </div>
            <div className='flex justify-between text-red-500'>
              <span>포인트 사용</span>
              <span>-{addComma(points)}원</span>
            </div>
            <div className='flex justify-between font-semibold mt-3 text-lg'>
              <span>최종 결제 금액</span>
              <span>{addComma(totalSalePrice + deliveryFee - points - couponDiscount)}원</span>
            </div>
          </div>

          {/* 결제 방법 */}
          <div className='border-b pb-6 mb-6'>
            <h3 className='text-lg font-semibold mb-4'>결제 방법</h3>
            <div className='w-full h-[50px] grid grid-cols-3 border border-[#6F4E37] rounded'>
              <button
                className={`${paymentMethod === 'card' && 'bg-[#6F4E37] text-white'} rounded-s`}
                onClick={() => setPaymentMethod('card')}
              >
                카드
              </button>
              <button
                className={`border-x border-[#6F4E37] ${paymentMethod === 'trans' && 'bg-[#6F4E37] text-white'}`}
                onClick={() => setPaymentMethod('trans')}
              >
                계좌이체
              </button>
              <button
                className={`${paymentMethod === 'phone' && 'bg-[#6F4E37] text-white'} rounded-e`}
                onClick={() => setPaymentMethod('phone')}
              >
                휴대폰
              </button>
            </div>
          </div>

          {/* 결제 버튼 */}
          <button
            className='w-full bg-[#A67B5B] hover:bg-[#6F4E37] text-white p-3 rounded '
            onClick={checkStock}
          >
            결제하기
          </button>
        </div>

        {/* 배송지 선택 모달 */}
        {showModal && (
          <PaymentAddressModal
            showModal={showModal}
            setShowModal={setShowModal}
            savedAddresses={savedAddresses}
            setSavedAddresses={setSavedAddresses}
            selectAddress={selectAddress}
          />
        )}
      </div>
    </div>
  )
}

export default Payment
