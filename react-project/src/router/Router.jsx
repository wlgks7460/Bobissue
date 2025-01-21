import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/conusumer/Home'

const router = createBrowserRouter([
  {
    // 기본 패스
    path: '/',
    element: <App />,
    children: [
      {
        // main page
        path: '',
        element: <Home />,
      },
    ],
  },
])

export default router
