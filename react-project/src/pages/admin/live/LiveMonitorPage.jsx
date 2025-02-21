import React from 'react'
import LiveMonitor from '../../../components/admin/live/LiveMonitor'

const LiveMonitorPage = () => {
  return (
    <div className='ml-64 mt-16 p-4'>
      <h1 className='text-2xl font-bold mb-6 text-center'>🖥️ 관리자 라이브 모니터링 모드</h1>

      <LiveMonitor />
    </div>
  )
}

export default LiveMonitorPage
