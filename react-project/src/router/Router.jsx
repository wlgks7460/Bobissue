import { createBrowserRouter } from 'react-router-dom'
import RootPage from '../pages/RootPage'
// 이용자 section
import ConsumerRoot from '../pages/conusumer/ConsumerRoot'
import ConsumerHome from '../pages/conusumer/Home'
import ConsumerLogin from '../pages/conusumer/Login'
import ConsumerSignup from '../pages/conusumer/Signup'
// 관리자 section
import AdminRoot from '../pages/admin/AdminRoot'
import AdminHome from '../components/admin/AdminHome'
import Signup from '../pages/conusumer/Signup'

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
          {
            path: 'signup',
            element: <Signup />,
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
            element: <AdminHome />,
          },
        ],
      },
    ],
  },
])

export default router
