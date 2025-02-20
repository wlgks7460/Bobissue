import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import dayjs from 'dayjs'
import MyPageCalendarItem from '../../../components/consumer/mypage/MyPageCalendarItem'
import MyPageCalendarModal from '../../../components/consumer/mypage/MyPageCalendarModal'
import API from '../../../utils/API'
import { loadingReducerActions } from '../../../redux/reducers/loadingSlice'

moment.locale('ko') // 한글 버전
const localizer = momentLocalizer(moment)

const MyPageCalendar = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.user.userInfo)

  const [selectedDate, setSelectedDate] = useState(null) // 클릭한 날짜
  const [modalOpen, setModalOpen] = useState(false) // 모달 상태

  const [currentYear, setCurrentYear] = useState(dayjs().year()) // 현재 연도
  const [currentMonth, setCurrentMonth] = useState(dayjs().month() + 1) // 현재 월

  const [events, setEvents] = useState([]) // 캘린더에 표시할 이벤트

  const [tdee, setTdee] = useState() // 일일 권장 칼로리

  // 숫자 , 찍기
  const addComma = (price) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return returnString
  }

  // 일일 권장 칼로리 계산 함수
  const calculateTDEE = (weight, height, age, gender, activityLevel = 'sedentary') => {
    let BMR

    if (gender === 'M') {
      BMR = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    }

    return Math.round(BMR * (activityMultipliers[activityLevel] || 1.2)) // 기본값 적용
  }
  useEffect(() => {
    const age = dayjs().year() - dayjs(userInfo.birthday).year()
    setTdee(calculateTDEE(userInfo.weight, userInfo.height, age, userInfo.gender))
  }, [userInfo])

  // 날짜 클릭시 모달 출력
  const handleDateClick = (slotInfo) => {
    const clickedDate = dayjs(slotInfo.start).format('YYYY-MM-DD')
    setSelectedDate(clickedDate)
    setModalOpen(true) // 모달 열기
  }

  // 월별 데이터 가져오기
  const getCalendarData = (year, month) => {
    dispatch(loadingReducerActions.setLoading(true))
    API.get(`/calendar/${year}/${month}`)
      .then((res) => {
        const eventData = Object.keys(res.data.result.data).map((key) => {
          return {
            start: dayjs(key).toDate(),
            end: dayjs(key).toDate(),
            title: `${res.data.result.data[key]} kCal`,
            cal: res.data.result.data[key],
          }
        })
        setEvents(eventData)
        dispatch(loadingReducerActions.setLoading(false))
      })
      .catch((err) => {
        console.error(err)
        dispatch(loadingReducerActions.setLoading(false))
      })
  }

  useEffect(() => {
    // mount
    getCalendarData(currentYear, currentMonth)
    // unmount
    return () => {}
  }, [currentYear, currentMonth])

  // 커스텀 툴바
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV')
      const newMonth = dayjs(toolbar.date).subtract(1, 'month')
      setCurrentYear(newMonth.year())
      setCurrentMonth(newMonth.month() + 1)
    }
    const goToNext = () => {
      toolbar.onNavigate('NEXT')
      const newMonth = dayjs(toolbar.date).add(1, 'month')
      setCurrentYear(newMonth.year())
      setCurrentMonth(newMonth.month() + 1)
    }

    const formattedDate = dayjs(toolbar.date).format('YYYY년 M월')

    return (
      <div className='flex justify-between p-3'>
        <button onClick={goToBack} className='text-[#6F4E37]'>
          이전
        </button>
        <span className='text-lg font-bold'>{formattedDate}</span>
        <button onClick={goToNext} className='text-[#6F4E37]'>
          다음
        </button>
      </div>
    )
  }
  // 커스텀 헤더
  const CustomWeekdayHeader = ({ label, date }) => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    const dayIndex = dayjs(date).day() // 0 = 일요일, 6 = 토요일
    return (
      <span className={`${dayIndex === 0 && 'text-red-500'} ${dayIndex === 6 && 'text-blue-500'}`}>
        {weekdays[dayIndex]}
      </span>
    )
  }

  return (
    <div className='p-5'>
      <h2 className='text-xl text-center mb-5'>내 식단 관리</h2>
      <div className='flex items-end gap-3'>
        <span className='text-gray-400 text-sm'>일일 권장 칼로리</span>
        <span>{addComma(tdee)} kcal</span>
      </div>
      <Calendar
        localizer={localizer}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 600 }}
        views={['month']}
        defaultView='month'
        selectable
        onSelectSlot={handleDateClick}
        messages={{
          next: '다음',
          previous: '이전',
          today: '오늘',
          month: '월',
          week: '주',
          day: '일',
          agenda: '목록',
          date: '날짜',
          time: '시간',
          event: '이벤트',
          noEventsInRange: '등록된 이벤트가 없습니다.',
        }}
        components={{
          month: {
            header: CustomWeekdayHeader,
            dateHeader: (props) => <MyPageCalendarItem {...props} events={events} tdee={tdee} />,
          },
          toolbar: CustomToolbar,
        }}
      />
      {modalOpen && (
        <MyPageCalendarModal
          setModalOpen={setModalOpen}
          selectedDate={selectedDate}
          getCalendarData={getCalendarData}
          currentYear={currentYear}
          currentMonth={currentMonth}
        />
      )}
    </div>
  )
}

export default MyPageCalendar
