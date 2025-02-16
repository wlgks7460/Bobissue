import { createBrowserRouter } from 'react-router-dom'
import RootPage from '../pages/RootPage'
// 이용자 section
import ConsumerRoot from '../pages/consumer/ConsumerRoot'
import ConsumerHome from '../pages/consumer/Home'
// 이용자 로그인, 회원가입
import ConsumerLogin from '../pages/consumer/Login'
import ConsumerSignup from '../pages/consumer/Signup'
import ConsumerNaverLogin from '../pages/consumer/NaverLogin'
import ConsumerKakaoLogin from '../pages/consumer/KakaoLogin'
// 이용자 상품 구매
import ConsumerItemDetail from '../pages/consumer/ItemDetail'
import ConsumerCart from '../pages/consumer/Cart'
import ConsumerPayment from '../pages/consumer/Payment'
import ConsumerSearch from '../pages/consumer/Search'
import ConsumerCategory from '../pages/consumer/Category'
// 이용자 마이페이지
import ConsumerMypage from '../pages/consumer/mypage/MyPage'
import ConsumerMyPageInfo from '../pages/consumer/mypage/MyPageInfo'
import ConsumerMyPageAddress from '../pages/consumer/mypage/MyPageAddress'
import ConsumerMyPageOrder from '../pages/consumer/mypage/MyPageOrder'
import ConsumerMyPageCalendar from '../pages/consumer/mypage/MyPageCalendar'
import ConsumerMyPageRecipe from '../pages/consumer/mypage/MyPageRecipe'
import ConsumerMyPageRecipeCreate from '../pages/consumer/mypage/MyPageRecipeCreate'
import ConsumerMyPageRecipeUpdate from '../pages/consumer/mypage/MyPageRecipeUpdate'
// 이용자 고객센터
import ConsumerBoard from '../pages/consumer/board/Board'
import ConsumerBoardFAQ from '../pages/consumer/board/BoardFAQ'
import ConsumerBoardNotice from '../pages/consumer/board/BoardNotice'
import ConsumerBoardNoticeDetail from '../pages/consumer/board/BoardNoticeDetail'
import ConsumerBoardQuestion from '../pages/consumer/board/BoardQuestion'
// 이용자 레시피
import ConsumerRecipe from '../pages/consumer/Recipe'
import ConsumerRecipeDetail from '../pages/consumer/RecipeDetail'

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
import MonitorOrders from '../pages/admin/seller/MonitorOrderPage'
import MonitorProducts from '../pages/admin/seller/MonitorProductPage'
import ItemDetailPage from '../pages/admin/seller/ItemDetailPage'
// import SellerDetailPage from '../pages/admin/seller/SellerDetailPage'
import SellerStatisticsPage from '../pages/admin/seller/SellerStatisticsPage'
// (관리자) 카테고리관리
import CategoryManagementPage from '../pages/admin/category/CategoryManagementPage'
import CategoryDetailPage from '../pages/admin/category/CategoryDetailPage'
// (관리자) 라이브커머스관리
import LiveManagementPage from '../pages/admin/live/LiveManagementPage'
import LiveNoticePage from '../pages/admin/live/LiveNoticePage'
import LiveOnAirPage from '../pages/admin/live/LiveOnAirPage'
import LiveEndedPage from '../pages/admin/live/LiveEndedPage'
import ViwerMangagementPage from '../pages/admin/live/ViewerManagementPage'
import LiveCalenderPage from '../pages/admin/live/LiveCalenderPage'
import LiveRegisterDetailPage from '../pages/admin/live/LiveRegisterDetailPage'
import LiveMonitorPage from '../pages/admin/live/LiveMonitorPage'
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

// (관리자) 쇼핑몰 분석
import PerformancePage from '../pages/admin/analytics/PerformancePage'
import CategoryPage from '../pages/admin/analytics/CategoryPage'
import TimesalesPage from '../pages/admin/analytics/TimesalesPage'

//판매자 페이지
import * as Seller from '../pages/seller/import'

//채팅 - 웹소캣 관련 페이지(test용)
import ChatRoomPage from '../pages/admin/chat/ChatPage'
import CategoryAnalysisPage from '../pages/admin/analytics/CategoryPage'
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
            path: 'naver-login',
            element: <ConsumerNaverLogin />,
          },
          {
            path: 'kakao-login',
            element: <ConsumerKakaoLogin />,
          },
          {
            path: 'signup',
            element: <ConsumerSignup />,
          },
          {
            path: 'mypage',
            element: <ConsumerMypage />,
            children: [
              {
                path: 'order',
                element: <ConsumerMyPageOrder />,
              },
              {
                path: 'info',
                element: <ConsumerMyPageInfo />,
              },
              {
                path: 'address',
                element: <ConsumerMyPageAddress />,
              },
              {
                path: 'calender',
                element: <ConsumerMyPageCalendar />,
              },
              {
                path: 'recipe',
                element: <ConsumerMyPageRecipe />,
              },
              {
                path: 'recipe/create',
                element: <ConsumerMyPageRecipeCreate />,
              },
              {
                path: 'recipe/update/:recipeNo',
                element: <ConsumerMyPageRecipeUpdate />,
              },
            ],
          },
          {
            path: 'search',
            element: <ConsumerSearch />,
          },
          {
            path: 'category/:categoryNo',
            element: <ConsumerCategory />,
          },
          {
            path: 'category/:categoryNo/:child',
            element: <ConsumerCategory />,
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
          {
            path: 'board',
            element: <ConsumerBoard />,
            children: [
              {
                path: 'faq',
                element: <ConsumerBoardFAQ />,
              },
              {
                path: 'notice',
                element: <ConsumerBoardNotice />,
              },
              {
                path: 'notice/:noticeNo',
                element: <ConsumerBoardNoticeDetail />,
              },
              {
                path: 'question',
                element: <ConsumerBoardQuestion />,
              },
            ],
          },
          {
            path: 'recipe',
            element: <ConsumerRecipe />,
          },
          {
            path: 'recipe/:recipeNo',
            element: <ConsumerRecipeDetail />,
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
        path: '/seller/company/register',
        element: <Seller.RegisterCompany />,
      },

      {
        // seller section
        path: 'seller',
        element: <Seller.SellerHome />,
        children: [
          //회사등록관련

          {
            path: '/seller/company/append',
            element: <Seller.AppendAccount />, // ✅ Seller. 접두사 추가
          },
          {
            path: 'company/search',
            element: <Seller.SearchAccount />, // ✅ Seller. 접두사 추가
          },
          {
            path: 'company/update',
            element: <Seller.UpdateCompany />,
          },
          //상품 관리 관련
          {
            path: '',
            element: <Seller.Dashboard />,
          },
          {
            path: 'products/view/:itemNo',
            element: <Seller.PrView />,
          },
          {
            path: 'products/view/:itemNo/update',
            element: <Seller.PrUpdate />,
          },
          {
            path: 'products/view/:itemNo/delete',
            element: <Seller.PrDelete />,
          },
          {
            path: 'products/register',
            element: <Seller.Register />,
          },
          {
            path: 'products/Search',
            element: <Seller.Search />,
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
            element: <Seller.Verification />,
          },
          {
            path: 'account/update-password',
            element: <Seller.UpdatePassword />,
          },
          //판매자 탈퇴
          {
            path: 'account/vender/info',
            element: <Seller.VenderInfo />,
          },
          {
            path: 'account/update-password',
            element: <Seller.UpdatePassword />,
          },
          {
            path: 'account/verification',
            element: <Seller.Verification />,
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
          {
            path: 'inquiries/report',
            element: <Seller.Report />,
          },
          //판매통계 관련
          {
            path: 'stats/overview',
            element: <Seller.StatOverview />,
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
          //라이브 관련
          {
            path: 'lives',
            children: [
              {
                path: 'home',
                element: <Seller.LiveHome />,
              },
              {
                path: 'livestream',
                element: <Seller.LiveStream />,
              },
              {
                path: 'apply',
                element: <Seller.LiveApply />,
              },
            ],
          },
        ],
      },

      {
        // admin section
        path: 'admin',
        element: <AdminRoot />,
        children: [
          {
            index: true,
            path: '',
            element: <AdminHome />,
          },
          {
            path: 'home',
            element: <AdminHome />,
          },
          {
            path: 'login',
            element: <AdminLoginPage />,
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
              // {
              //   path: ':sellerNo', // 판매자 상세조회 페이지
              //   element: <SellerDetailPage />,
              // },
              {
                path: 'register',
                element: <SellerRegisterPage />, // 판매자 신규신청 페이지
              },
              {
                path: 'tree',
                element: <SellerTreePage />, // 판매자 트리구조 페이지
              },
              {
                path: 'statistics',
                element: <SellerStatisticsPage />,
              },
              {
                path: 'monitor',
                children: [
                  {
                    path: 'orders', // 주문 현황 페이지
                    element: <MonitorOrders />,
                  },
                  {
                    path: 'products',
                    children: [
                      {
                        path: '',
                        element: <MonitorProducts />,
                      },
                      {
                        path: ':itemNo',
                        element: <ItemDetailPage />,
                      },
                    ],
                  },
                ],
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
            children: [
              {
                path: '',
                element: <CategoryManagementPage />, // 카테고리 관리 페이지
              },
              {
                path: ':categoryNo',
                element: <CategoryDetailPage />, // 카테고리 상세 페이지
              },
            ],
          },
          {
            // 라이브 커머스 섹션
            path: 'live',
            children: [
              {
                path: 'register', // 라이브 신청 수리 페이지
                children: [
                  {
                    path: '',
                    element: <LiveManagementPage />,
                  },
                  {
                    path: ':castNo',
                    element: <LiveRegisterDetailPage />,
                  },
                ],
              },
              {
                path: 'calender', // 라이브 일정 관리 페이지
                element: <LiveCalenderPage />,
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
                path: 'monitor',
                element: <LiveMonitorPage />,
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
            ],
          },
          {
            // 쇼핑몰 분석 파트
            path: 'analytics',
            children: [
              {
                path: 'performance',
                element: <PerformancePage />,
              },
              {
                path: 'category',
                element: <CategoryPage />,
              },
              {
                path: 'timesales',
                element: <TimesalesPage />,
              },
            ],
          },
        ],
      },
      {
        // 웹소캣 연결 테스트용 채팅방 라우터
        path: '/chat',
        element: <ChatRoomPage />,
      },
    ],
  },
])

export default router
