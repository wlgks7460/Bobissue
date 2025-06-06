export { default as SellerHome } from './SellerHome'
export { default as Dashboard } from './Dashboard'

// 판매자 회원가입 관련
export { default as Login } from './Login/Login'
export { default as Signup } from './Login/Signup'

// 판매자 회사 등록 관련
export { default as RegisterCompany } from './Company/Register' // 회사 등록
export { default as AppendAccount } from './Company/Append' // 계정 추가
export { default as SearchAccount } from './Company/Search' // 계정 조회
export { default as UpdateCompany } from './Company/Update'

// 상품 관리 관련
export { default as Register } from './Products/Register'
export { default as Search } from './Products/Search'
export { default as PrView } from './Products/View'
export { default as PrUpdate } from './Products/Update'
export { default as PrDelete } from './Products/Delete'

// 주문 배송 관련
export { default as Delivery } from './Delivery/Delivers'
export { default as Orders } from './Delivery/Orders'
export { default as Exchange } from './Delivery/Exchange'
export { default as Return } from './Delivery/Return'
export { default as Ship } from './Delivery/Ship'
export { default as OrDetail } from './Delivery/Details'

// 정산 관련
export { default as Overview } from './Settlement/Overview'
export { default as Settleview } from './Settlement/View'
export { default as Details } from './Settlement/Details'
export { default as Accounts } from './Settlement/Accounts'

// 판매자 정보 관련
export { default as UpdatePassword } from './Account/Update-Password'
export { default as Verification } from './Account/Verification'
export { default as VenderInfo } from './Account/VenderInfo'

// 문의 관련
export { default as Report } from './Inquiry/Report'
export { default as InView } from './Inquiry/View'
export { default as InList } from './Inquiry/List'
export { default as InReply } from './Inquiry/Reply'
export { default as InReplylist } from './Inquiry/Replylist'

// 판매 통계 관련
export { default as StatOverview } from './Stats/Overview'
export { default as Products } from './Stats/Products'

// 공지사항 관련
export { default as Notices } from './Notices/Notices'
export { default as NoticesView } from './Notices/View'

// 라이브커머스
export { default as LiveHome } from './Lives/LiveHome'
export { default as LiveApply } from './Lives/LiveApply'
export { default as LiveStream } from './Lives/LiveShow/LiveStream2'
