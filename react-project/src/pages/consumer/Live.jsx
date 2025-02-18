import React, { useEffect, useRef, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined'
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined'
import LiveItem from '../../components/consumer/live/LiveItem'

const Live = () => {
  const [cast, setCast] = useState()
  const [chat, setChat] = useState()

  const [isHover, setIsHover] = useState(false)
  const [isPause, setIsPause] = useState(false)

  const fullScreenRef = useRef()
  const [isFullScreen, setIsFullScreen] = useState(false)

  const enterFullscreen = () => {
    if (!isFullScreen) {
      // 전체 화면
      if (fullScreenRef.current?.requestFullscreen) {
        fullScreenRef.current.requestFullscreen()
      } else if (fullScreenRef.current?.webkitRequestFullscreen) {
        fullScreenRef.current.webkitRequestFullscreen() // Safari
      } else if (fullScreenRef.current?.mozRequestFullScreen) {
        fullScreenRef.current.mozRequestFullScreen() // Firefox
      } else if (fullScreenRef.current?.msRequestFullscreen) {
        fullScreenRef.current.msRequestFullscreen() // IE/Edge
      }
    } else {
      // 전체화면 해제
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen() // Safari
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen() // Firefox
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen() // IE/Edge
      }
    }
  }

  const [liveItems, setLiveItems] = useState([])
  const chatInputRef = useRef()

  // 전체 화면 감지
  useEffect(() => {
    // mount
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange) // Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange) // Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange) // IE/Edge
    // unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // 상품 드래그 관련
  const scrollContainerRef = useRef()

  // 드래그 기능
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const x = e.clientX - startX
    scrollContainerRef.current.scrollLeft = scrollLeft - x
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const castItemList = [
    { itemNo: 0, name: '상품1' },
    { itemNo: 1, name: '상품2' },
    { itemNo: 2, name: '상품3' },
    { itemNo: 3, name: '상품4' },
    { itemNo: 4, name: '상품5' },
    { itemNo: 5, name: '상품6' },
    { itemNo: 6, name: '상품7' },
    { itemNo: 7, name: '상품8' },
    { itemNo: 8, name: '상품9' },
  ]

  const allToCart = () => {
    let cartData = JSON.parse(localStorage.getItem('cart')) || []
    let isDuplicate = false

    const newItems = castItemList
      .map((v) => {
        const existingIndex = cartData.findIndex((item) => item.itemNo === v.itemNo)
        if (existingIndex !== -1) {
          cartData[existingIndex].count += 1
          isDuplicate = true
          return null
        }
        return { itemNo: v.itemNo, count: 1 }
      })
      .filter(Boolean) // null 값 제거

    if (newItems.length > 0) {
      cartData = [...cartData, ...newItems]
      localStorage.setItem('cart', JSON.stringify(cartData))
    }

    alert(isDuplicate ? '중복 상품은 수량을 추가하였습니다.' : '장바구니에 담았습니다.')
  }

  return (
    <div>
      <SearchBar />
      <div className='min-h-[70vh] flex justify-center'>
        <div className='w-[70rem] flex mt-10 border border-[#6F4E37] rounded'>
          <div className='w-3/4 h-full flex flex-col rounded'>
            {/* 라이브 방송 */}
            <div
              className='grow relative'
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
              ref={fullScreenRef}
            >
              {isHover && (
                <div className='w-full h-full flex items-end bg-black/50 absolute top-0 left-0 rounded-tl'>
                  <div className='w-full flex justify-between'>
                    <div className='m-2 '>
                      <button className='text-white' onClick={() => setIsPause(!isPause)}>
                        {isPause ? (
                          <PlayArrowIcon sx={{ fontSize: 30 }} />
                        ) : (
                          <PauseIcon sx={{ fontSize: 30 }} />
                        )}
                      </button>
                    </div>
                    <div className='m-2'>
                      <button className='text-white' onClick={enterFullscreen}>
                        {isFullScreen ? (
                          <FullscreenOutlinedIcon sx={{ fontSize: 30 }} />
                        ) : (
                          <FullscreenExitOutlinedIcon sx={{ fontSize: 30 }} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* 상품 */}
            <div className='flex-none w-full max-w-full h-[150px] border-t border-[#6F4E37] p-3'>
              <div className='flex justify-between'>
                <h3>판매 중 상품</h3>
                <button className='text-sm text-gray-400 hover:text-[#6F4E37]' onClick={allToCart}>
                  전체 상품 담기
                </button>
              </div>
              <div
                ref={scrollContainerRef}
                className='flex gap-3 overflow-x-auto no-scrollbar flex-nowrap'
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} // 마우스가 벗어났을 때도 드래그 끝내기
              >
                {castItemList.map((v) => (
                  <LiveItem key={v.itemNo} item={v} />
                ))}
              </div>
            </div>
          </div>
          {/* 채팅 */}
          <div className='w-1/4 h-full flex flex-col border-s border-[#6F4E37] rounded-e'>
            {/* 채팅 출력 */}
            <div className='grow p-3 bg-[#F8F0E5] rounded-tr'></div>
            {/* 채팅 입력 */}
            <div className='w-full flex-none flex items-end bg-[#F8F0E5] border-t border-[#6F4E37] p-3 rounded-br'>
              <textarea
                type='text'
                ref={chatInputRef}
                className='grow h-[32px] min-h-[32px] max-h-[100px] p-1 border border-[#6F4E37] text-sm 
                resize-none overflow-y-auto rounded outline-none focus:ring-0'
                onInput={(e) => {
                  e.target.style.height = '32px' // 높이 초기화
                  e.target.style.height = e.target.scrollHeight + 'px' // 내용에 맞게 높이 조정
                }}
              ></textarea>
              <button className='flex-none px-2 py-1 ms-1 rounded bg-gray-300 hover:bg-[#6F4E37] hover:text-white text-sm'>
                <SendOutlinedIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Live
