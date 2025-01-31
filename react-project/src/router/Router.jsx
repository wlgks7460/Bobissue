import { createBrowserRouter } from 'react-router-dom'
import RootPage from '../pages/RootPage'
// 이용자 section
import ConsumerRoot from '../pages/consumer/ConsumerRoot'
import ConsumerHome from '../pages/consumer/Home'
import ConsumerLogin from '../pages/consumer/Login'
import ConsumerSignup from '../pages/consumer/Signup'
import ConsumerItemDetail from '../pages/consumer/ItemDetail'
import ConsumerCart from '../pages/consumer/Cart'
import ConsumerPayment from '../pages/consumer/Payment'

// 관리자 section

// (관리자) home
import AdminRoot from '../pages/admin/AdminRoot'
import AdminHome from '../components/admin/home/AdminHome'
import AdminLoginPage from '../pages/admin/login/AdminLoginPage'
// (관리자) 회원관리
import MemberInfoPage from '../pages/admin/member/MemberInfoPage'
import MemberLevelPage from '../pages/admin/member/MemberLevelPage'
import MemberRegisterPage from '../pages/admin/member/MemberRegisterPage'
import MemberExcelPage from '../pages/admin/member/MemberExcelPage'
import MemberEmailPage from '../pages/admin/member/MemberEmailPage'
import MemberDetailPage from '../pages/admin/member/MemberDetailPage'
// (관리자) 포인트관리 & 일일월별 통계
import PointExcelPage from '../pages/admin/point/PointExcelPage'
import PointInfoPage from '../pages/admin/point/PointInfoPage'
import DailyStatisticsPage from '../pages/admin/statistics/DailyStatisticsPage'
import MonthlyStatisticsPage from '../pages/admin/statistics/MonthlyStatisticsPage'
// (관리자) 판매자관리
import SellerInfoPage from '../pages/admin/seller/SellerInfoPage'
import SellerRegisterPage from '../pages/admin/seller/SellerRegisterPage'
import SellerFeePage from '../pages/admin/seller/SellerFeePage'
import SellerFeeRuquestPage from '../pages/admin/seller/SellerFeeRequestPage'
import SellerTreePage from '../pages/admin/seller/SellerTreePage'
import SellerOrderPage from '../pages/admin/seller/SellerOrderPage'
// (관리자) 카테고리관리
import CategoryManagementPage from '../pages/admin/category/CategoryManagementPage'
// (관리자) 라이브커머스관리
import LiveManagementPage from '../pages/admin/live/LiveManagementPage'
import LiveNoticePage from '../pages/admin/live/LiveNoticePage'
import LiveOnAirPage from '../pages/admin/live/LiveOnAirPage'
import LiveEndedPage from '../pages/admin/live/LiveEndedPage'
import ViwerMangagementPage from '../pages/admin/live/ViewerManagementPage'
// (관리자) 컨텐츠관리
import CouponIssuePage from '../pages/admin/coupon/CouponIssuePage'
import CouponStatusPage from '../pages/admin/coupon/CouponStatusPage'
import ListPage from '../pages/admin/screen/ListPage'
import RegisterPage from '../pages/admin/screen/RegisterPage'
import ReportListPage from '../pages/admin/report/ListPage'
import ReportDetailPage from '../pages/admin/report/DetailPage'
// (관리자) CS 관리
import NotificationPage from '../pages/admin/cs/NotificationPage'
import CSCenterPage from '../pages/admin/cs/CSCenterPage'
import NoticePage from '../pages/admin/cs/NoticePage'
import FAQPage from '../pages/admin/cs/FAQPage'
//판매자 페이지
import * as Seller from '../pages/seller/import'
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
            element: <ConsumerSignup />,
          },
          {
            path: 'item/:itemNo',
            element: <ConsumerItemDetail />,
          },
          {
            path: 'cart',
            element: <ConsumerCart />,
          },
          {
            path: 'payment',
            element: <ConsumerPayment />,
          },
        ],
      },
      //판매자 회원가입,로그인
      {
        path: 'seller/login',
        element: <Seller.Login />,
      },
      {
        path: 'seller/signup',
        element: <Seller.Signup />,
      },
      {
        // seller section
        path: 'seller',
        element: <Seller.SellerHome />,
        children: [
          //상품 관리 관련
          {
            path: '',
            element: <Seller.SMain />,
          },
          {
            path: 'products/view/:productId',
            element: <Seller.PrView />,
          },
          {
            path: 'products/view/:productId/update',
            element: <Seller.PrUpdate />,
          },
          {
            path: 'products/view/:productId/delete',
            element: <Seller.PrDelete />,
          },
          {
            path: 'products/register',
            element: <Seller.Register />,
          },
          {
            path: 'products/inquiry',
            element: <Seller.Inquiry />,
          },
          {
            path: 'products/update',
            element: <Seller.Update />,
          },
          //주문 배송 관련
          {
            path: 'delivery/delivers',
            element: <Seller.Delivery />,
          },
          {
            path: 'delivery/exchanges',
            element: <Seller.Exchange />,
          },
          {
            path: 'delivery/orders',
            element: <Seller.Orders />,
          },
          {
            path: 'delivery/returns',
            element: <Seller.Return />,
          },
          {
            path: 'delivery/shipping',
            element: <Seller.Ship />,
          },
          {
            path: 'delivery/:orderId',
            element: <Seller.OrDetail />,
          },
          //정산 관련
          {
            path: 'settlement/overview',
            element: <Seller.Overview />,
          },
          {
            path: 'settlement/view',
            element: <Seller.Settleview />,
          },
          {
            path: 'settlement/details',
            element: <Seller.Details />,
          },
          {
            path: 'settlement/accounts',
            element: <Seller.Accounts />,
          },
          //판매자정보 관련
          {
            path: 'account/verification',
            element: <Seller.AcVerification />,
          },
          {
            path: 'account/info',
            element: <Seller.Info />,
          },
          {
            path: 'account/update-info',
            element: <Seller.UpdateInfo />,
          },
          {
            path: 'account/update-password',
            element: <Seller.UpdatePassword />,
          },
          //판매자 탈퇴
          {
            path: 'account/withdrawal',
            element: <Seller.Withdrawal />,
          },
          //문의 관련
          {
            path: 'inquiries/list',
            element: <Seller.InList />,
          },
          {
            path: 'inquiries/view',
            element: <Seller.InView />,
          },
          {
            path: 'inquiries/reply',
            element: <Seller.InReply />,
          },
          {
            path: 'inquiries/replylist',
            element: <Seller.InReplylist />,
          },
          //판매통계 관련
          {
            path: 'stats/performance',
            element: <Seller.Performance />,
          },
          {
            path: 'stats/products',
            element: <Seller.Products />,
          },
          //공지사항 관련
          {
            path: 'notices',
            element: <Seller.Notices />,
          },
          {
            path: 'notices/view',
            element: <Seller.NoticesView />,
          },
        ],
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
                path: ':userNo', // 회원 상세 페이지
                element: <MemberDetailPage />,
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
          {
            // 판매자 관리 섹션
            path: 'seller',
            children: [
              {
                path: 'info', // 판매자 관리 페이지
                element: <SellerInfoPage />,
              },
              {
                path: 'register',
                element: <SellerRegisterPage />, // 판매자 신규신청 페이지
              },
              {
                path: 'tree',
                element: <SellerTreePage />, // 판매자 트리구조 페이지
              },
              {
                path: 'order',
                element: <SellerOrderPage />, // 판매자 주문통계 페이지
              },
            ],
          },
          {
            // 판매자 수수료 섹션
            path: 'fee',
            children: [
              {
                path: 'info', // 판매자 수수료내역 페이지
                element: <SellerFeePage />,
              },
              {
                path: 'request',
                element: <SellerFeeRuquestPage />,
              },
            ],
          },
          {
            // 카테고리 관리 섹션
            path: 'category',
            element: <CategoryManagementPage />, // 카테고리 관리 페이지
          },
          {
            // 라이브 커머스 섹션
            path: 'live',
            children: [
              {
                path: 'management', // 라이브 관리 (신청/일정) 페이지
                element: <LiveManagementPage />,
              },
              {
                path: 'notice', // 라이브 공지 관리 페이지
                element: <LiveNoticePage />,
              },
              {
                path: 'onair', // 진행중 라이브 페이지
                element: <LiveOnAirPage />,
              },
              {
                path: 'end', // 종료된 라이브 페이지
                element: <LiveEndedPage />,
              },
              {
                path: 'viewer', // 시청자 관리 페이지
                element: <ViwerMangagementPage />,
              },
            ],
          },
          // 컨텐츠 관리
          {
            // 쿠폰 관리 섹션'
            path: 'coupon',
            children: [
              {
                // 쿠폰 관리 (현황 조회) 페이지
                path: 'info',
                element: <CouponStatusPage />,
              },
              {
                // 쿠폰 발급 페이지
                path: 'issue',
                element: <CouponIssuePage />,
              },
            ],
          },
          // 화면 관리 섹션
          {
            path: 'screen',
            children: [
              {
                path: 'info', // 이벤트 배너 조회 페이지
                element: <ListPage />,
              },
              {
                path: 'register', // 이벤트 배너 등록 페이지
                element: <RegisterPage />,
              },
            ],
          },
          // 신고 관리 섹션
          {
            path: 'report',
            children: [
              {
                path: 'info', // 신고 조회 페이지
                element: <ReportListPage />,
              },
              {
                path: 'detail', // 신고 상세 조회 및 처리 페이지
                element: <ReportDetailPage />,
              },
            ],
          },
          // CS 관리 섹션
          {
            path: 'cs',
            children: [
              {
                path: 'notification', // 알림 관리 페이지
                element: <NotificationPage />,
              },
              {
                path: 'cscenter', // 고객센터 관리 페이지
                element: <CSCenterPage />,
              },
              {
                path: 'notice', // 공지사항 페이지
                element: <NoticePage />,
              },
              {
                path: 'FAQ', // FAQ 운영 페이지
                element: <FAQPage />,
              },
            ],
          },
        ],
      },
    ],
  },
])

export default router
