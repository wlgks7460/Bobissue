import { createBrowserRouter } from 'react-router-dom'
import RootPage from '../pages/RootPage'
// 이용자 section
import ConsumerRoot from '../pages/conusumer/ConsumerRoot'
import ConsumerHome from '../pages/conusumer/Home'
import ConsumerLogin from '../pages/conusumer/Login'
// 관리자 section
import AdminRoot from '../pages/admin/AdminRoot'
import AdminHome from '../components/admin/home/AdminHome'
import AdminLoginPage from '../pages/admin/login/AdminLoginPage'
import MemberInfoPage from '../pages/admin/member/MemberInfoPage'
import MemberLevelPage from '../pages/admin/member/MemberLevelPage'
import MemberRegisterPage from '../pages/admin/member/MemberRegisterPage'
import MemberExcelPage from '../pages/admin/member/MemberExcelPage'
import MemberEmailPage from '../pages/admin/member/MemberEmailPage'
import PointExcelPage from '../pages/admin/point/PointExcelPage'
import PointInfoPage from '../pages/admin/point/PointInfoPage'
import DailyStatisticsPage from '../pages/admin/statistics/DailyStatisticsPage'
import MonthlyStatisticsPage from '../pages/admin/statistics/MonthlyStatisticsPage'

const router = createBrowserRouter([
  {
    // 기본 패스
    path: '/',
    element: <RootPage />,
    children: [
      {
        // consumer section
        path: '',
        element: <ConsumerRoot />,
        children: [
          {
            path: '',
            element: <ConsumerHome />,
          },
          {
            path: 'login',
            element: <ConsumerLogin />,
          },
        ],
      },
      {
        // seller section
        path: 'seller',
      },
      {
        // admin section
        path: 'admin',
        element: <AdminRoot />,
        children: [
          {
            // admin - HomePage
            path: '',
            element: <AdminLoginPage />,
          },
          {
            // admin - LoginPage
            path: 'home',
            element: <AdminHome />,
          },
          {
            // 회원관리 섹션
            path: 'members',
            children: [
              {
                path: 'info', // 회원 정보관리
                element: <MemberInfoPage />,
              },
              {
                path: 'level', // 회원 레벨 관리
                element: <MemberLevelPage />,
              },
              {
                path: 'register', // 회원 등록
                element: <MemberRegisterPage />,
              },
              {
                path: 'excel', // 회원 엑셀 등록
                element: <MemberExcelPage />,
              },
              {
                path: 'email', // 회원 일괄메일발송
                element: <MemberEmailPage />,
              },
            ],
          },
          {
            // 포인트 관리 섹션
            path: 'points',
            children: [
              {
                path: 'info', // 포인트 관리 페이지
                element: <PointInfoPage />,
              },
              {
                path: 'excel', // 포인트 엑셀 일괄등록
                element: <PointExcelPage />,
              },
            ],
          },
          {
            // 통계 섹션
            path: 'statistics',
            children: [
              {
                path: 'daily', // 일별 통계 페이지
                element: <DailyStatisticsPage />,
              },
              {
                path: 'monthly', //월별 통계 페이지
                element: <MonthlyStatisticsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
])

export default router
