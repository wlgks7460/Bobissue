import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import RootPage from '../pages/RootPage'
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
        element: <Home />,
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
