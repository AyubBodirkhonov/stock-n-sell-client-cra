import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const HomePage = Loadable(lazy(() => import('../pages/HomePage')));
export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));

/* FOR ADMINS */
export const UserListPage = Loadable(lazy(() => import('../pages/admin/user/PageUserList')));
export const UserInfoPage = Loadable(lazy(() => import('../pages/admin/user/PageUserInfo')));
export const UserCreatePage = Loadable(lazy(() => import('../pages/admin/user/PageUserCreate')));

export const BlackListPage = Loadable(
  lazy(() => import('../pages/admin/black-list/PageBlackList'))
);
export const LogListPage = Loadable(lazy(() => import('../pages/admin/log/PageLogList')));

/* FOR USERS */
export const SellOperationPage = Loadable(
  lazy(() => import('../pages/sell/operation/PageSellOperation'))
);
export const SellOperationInfoPage = Loadable(
  lazy(() => import('../pages/sell/operation/PageSellOperationInfo'))
);
export const SellOperationCreatePage = Loadable(
  lazy(() => import('../pages/sell/operation/PageSellOperationCreate'))
);

export const PaymentPage = Loadable(lazy(() => import('../pages/finance/payment/PagePayment')));
export const PaymentInfoPage = Loadable(
  lazy(() => import('../pages/finance/payment/PagePaymentInfo'))
);

export const StockPage = Loadable(lazy(() => import('../pages/stock/stocks/PageStock')));
export const StockInfoPage = Loadable(lazy(() => import('../pages/stock/stocks/PageStockInfo')));

export const StockOperationPage = Loadable(
  lazy(() => import('../pages/stock/operation/PageStockOperation'))
);
export const StockOperationInfoPage = Loadable(
  lazy(() => import('../pages/stock/operation/PageStockOperationInfo'))
);
export const StockOperationCreatePage = Loadable(
  lazy(() => import('../pages/stock/operation/PageStockOperationCreate'))
);

export const ClientPage = Loadable(lazy(() => import('../pages/common/client/PageClient')));
export const ClientInfoPage = Loadable(lazy(() => import('../pages/common/client/PageClientInfo')));

export const GoodPage = Loadable(lazy(() => import('../pages/good/good/PageGood')));
export const GoodInfoPage = Loadable(lazy(() => import('../pages/good/good/PageGoodInfo')));

export const GoodCategoryPage = Loadable(
  lazy(() => import('../pages/good/good-category/PageGoodCategory'))
);
export const GoodCategoryInfoPage = Loadable(
  lazy(() => import('../pages/good/good-category/PageGoodCategoryInfo'))
);

export const SupplierPage = Loadable(lazy(() => import('../pages/common/supplier/PageSupplier')));
export const SupplierInfoPage = Loadable(
  lazy(() => import('../pages/common/supplier/PageSupplierInfo'))
);

export const BalanceAccountPage = Loadable(
  lazy(() => import('../pages/finance/balance-account/PageBalanceAccount'))
);

export const ExpensePage = Loadable(lazy(() => import('../pages/finance/expense/ExpensePage')));
export const ExpenseInfoPage = Loadable(
  lazy(() => import('../pages/finance/expense/ExpenseInfoPage'))
);
export const ExpenseCategoryPage = Loadable(
  lazy(() => import('../pages/finance/expense/ExpenseCategory'))
);
export const ExpenseCategoryInfoPage = Loadable(
  lazy(() => import('../pages/finance/expense/ExpenseCategoryInfo'))
);

/* PRINT-REPORT-TEMPLATES */
export const SellReportTemplate = Loadable(
  lazy(() => import('../pages/report/operation/sell-operation.report'))
);
export const StockReportTemplate = Loadable(
  lazy(() => import('../pages/report/operation/stock-operation.report'))
);

export const GoodSellReportTemplate = Loadable(
  lazy(() => import('../pages/report/operation/good-sell.report'))
);

export const PurchaseGoodReportTemplate = Loadable(
  lazy(() => import('../pages/report/operation/purchase-good.report'))
);

/* REPORTS */
export const FinalReport = Loadable(lazy(() => import('../pages/reports/FinalReportPage')));
export const DailySellReport = Loadable(
  lazy(() => import('../pages/reports/DailySellsReportPage'))
);
export const ExpenseReport = Loadable(lazy(() => import('../pages/reports/ExpenseReportPage')));

export const DailyPurchaseReport = Loadable(
  lazy(() => import('../pages/reports/GoodPurchaseReportPage'))
);
export const GoodSellReport = Loadable(lazy(() => import('../pages/reports/GoodSellsReportPage')));

export const AnalyticsPage = Loadable(lazy(() => import('../pages/AnalyticsPage')));
export const PageCashier = Loadable(lazy(() => import('../pages/common/PageCashier')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
