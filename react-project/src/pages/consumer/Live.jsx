import React, { useEffect, useRef, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined'
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined'

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

  return (
    <div>
      <SearchBar />
      <div className='min-h-[70vh] flex justify-center'>
        <div className='w-[70rem] flex mt-10 border border-[#6F4E37] rounded'>
          <div className='grow h-full flex flex-col rounded'>
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
            <div className='flex-none h-[150px] border-t border-[#6F4E37] p-3'>
              <h3>판매 중 상품</h3>
            </div>
          </div>
          {/* 채팅 */}
          <div className='flex-none w-1/4 h-full flex flex-col border-s border-[#6F4E37] rounded-e'>
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
