import React, { useRef, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'

const Live = () => {
  const [cast, setCast] = useState()
  const [chat, setChat] = useState()

  const [liveItems, setLiveItems] = useState([])
  const chatInputRef = useRef()

  return (
    <div>
      <SearchBar />
      <div className='min-h-[70vh] flex justify-center'>
        <div className='w-[70rem] flex mt-10 border border-[#6F4E37] rounded'>
          <div className='w-3/4 h-full flex flex-col rounded'>
            {/* 라이브 방송 */}
            <div className='grow'></div>
            {/* 상품 */}
            <div className='flex-none h-[200px] border-t border-[#6F4E37] p-3'>
              <h3>판매 중 상품</h3>
            </div>
          </div>
          {/* 채팅 */}
          <div className='w-1/4 h-full flex flex-col border-s border-[#6F4E37] rounded p-3'>
            {/* 채팅 출력 */}
            <div className='grow'></div>
            {/* 채팅 입력 */}
            <div className='w-full flex-none flex items-end'>
              <textarea
                type='text'
                ref={chatInputRef}
                className='grow h-[32px] max-h-[150px] p-1 border border-[#6F4E37] resize-none overflow-y-auto rounded outline-none focus:ring-0'
                onInput={(e) => {
                  e.target.style.height = '25px' // 높이 초기화
                  e.target.style.height = e.target.scrollHeight + 'px' // 내용에 맞게 높이 조정
                }}
              ></textarea>
              <button className='flex-none px-2 py-1 rounded bg-gray-300 hover:bg-[#6F4E37] hover:text-white text-sm'>
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
