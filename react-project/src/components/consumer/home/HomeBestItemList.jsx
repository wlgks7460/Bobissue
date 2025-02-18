import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ItemCard from '../common/ItemCard'
import API from '../../../utils/API'

const HomeBestItemList = ({ bestCategory }) => {
  const [items, setItems] = useState([]) // 상품 데이터 리스트
  // 화면 감지 관련
  const divRef = useRef(null)

  // top 데이터 불러오기
  const getBestItems = () => {
    API.get(`/item/${bestCategory.path}`)
      .then((res) => {
        setItems(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  const setting = {
    dots: false, // 개수 표시 점
    infinite: false, // 무한 캐러셀
    speed: 500, // 다음 컨텐츠까지의 속도
    slidesToShow: Math.min(items.length, 4), // 화면에 보이는 컨텐츠 수
    slidesToScroll: 1, // 스크롤 시 넘어가는 컨텐츠 수
    fade: false, // 페이드
    initalSlide: 0, // 시작 컨텐츠 번호
    variableWidth: true,
  }

  // 화면에 감지되면 데이터 불러오기
  useEffect(() => {
    // mount
    if (items.length > 0) return // 이미 실행되었으면 추가 실행 방지

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          getBestItems()
        }
      },
      { threshold: 0.5 }, // 50% 이상 보여야 감지
    )

    if (divRef.current) {
      observer.observe(divRef.current)
    }
    // unmount
    return () => {
      observer.disconnect()
    }
  }, [])
  return (
    <div className='w-[70rem]' ref={divRef}>
      <div className='flex justify-between mb-5'>
        <p className={`text-xl ${items.length < 1 && 'text-gray-600'}`}>{bestCategory.name}</p>
      </div>
      <Slider {...setting} className='best-item-slider'>
        {items.map((v) => (
          <ItemCard key={v.itemNo} item={v} />
        ))}
      </Slider>
    </div>
  )
}

export default HomeBestItemList
