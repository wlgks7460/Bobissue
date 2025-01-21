import { createBrowserRouter } from 'react-router-dom'
import RootPage from '../pages/RootPage'
import ConsumerRoot from '../pages/conusumer/ConsumerRoot'
import Home from '../pages/conusumer/Home'

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
        ],
      },
      {
        // seller section
        path: 'seller',
      },
      {
        // admin section
        path: 'admin',
      },
    ],
  },
])

export default router
