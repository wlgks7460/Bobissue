import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import RootPage from '../pages/RootPage'

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
      },
    ],
  },
])

export default router
