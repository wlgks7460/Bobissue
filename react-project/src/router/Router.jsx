import { createBrowserRouter } from 'react-router-dom'
import RootPage from '../pages/RootPage'
// 이용자 section
import ConsumerRoot from '../pages/conusumer/ConsumerRoot'
import ConsumerHome from '../pages/conusumer/Home'
import ConsumerLogin from '../pages/conusumer/Login'
// 관리자 section
import AdminRoot from '../pages/admin/AdminRoot'
import AdminHome from '../components/admin/AdminHome'
import AdminLoginPage from '../pages/admin/AdminLoginPage'

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
            //admin - LoginPage
            path: 'home',
            element: <AdminHome />,
          },
        ],
      },
    ],
  },
])

export default router
