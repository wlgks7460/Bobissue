import { createBrowserRouter } from 'react-router-dom'
import RootPage from '../pages/RootPage'
import ConsumerRoot from '../pages/conusumer/ConsumerRoot'
import Home from '../pages/conusumer/Home'
import Login from '../pages/conusumer/Login'
import AdminRoot from '../pages/admin/AdminRoot'
import AdminHome from '../components/admin/AdminHome'
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
            element: <Home />,
          },
          {
            path: 'login',
            element: <Login />,
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
