import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  AnalyticsPage,
  BalanceAccountPage,
  BlackListPage,
  ClientInfoPage,
  ClientPage,
  DailyPurchaseReport,
  DailySellReport,
  ExpenseCategoryPage,
  ExpenseInfoPage,
  ExpensePage,
  GoodCategoryInfoPage,
  GoodCategoryPage,
  GoodInfoPage,
  GoodPage,
  GoodSellReport,
  GoodSellReportTemplate,
  HomePage,
  LoginPage,
  LogListPage,
  Page404,
  PageCashier,
  PaymentInfoPage,
  PaymentPage,
  PurchaseGoodReportTemplate,
  SellOperationCreatePage,
  SellOperationInfoPage,
  SellOperationPage,
  SellReportTemplate,
  StockInfoPage,
  StockOperationCreatePage,
  StockOperationInfoPage,
  StockOperationPage,
  StockPage,
  StockReportTemplate,
  SupplierInfoPage,
  SupplierPage,
  UserCreatePage,
  UserInfoPage,
  UserListPage,
  FinalReport,
  ExpenseReport,
} from './elements';
import ExpenseCategoryInfo from '../pages/finance/expense/ExpenseCategoryInfo';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'home', element: <HomePage /> },
        {
          path: 'admin',
          children: [
            { element: <Navigate to="/dashboard/admin/user" replace />, index: true },
            { path: 'user', element: <UserListPage /> },
            { path: 'user/:id', element: <UserInfoPage /> },
            { path: 'user/create', element: <UserCreatePage /> },
            { path: 'log', element: <LogListPage /> },
            { path: 'black-list', element: <BlackListPage /> },
          ],
        },
        {
          path: 'operation',
          children: [
            { element: <Navigate to="/dashboard/operation/sell-operation" replace />, index: true },
            { path: 'sell-operation', element: <SellOperationPage /> },
            { path: 'sell-operation/create', element: <SellOperationCreatePage /> },
            { path: 'sell-operation/:id', element: <SellOperationInfoPage /> },
            { path: 'stock-operation', element: <StockOperationPage /> },
            { path: 'stock-operation/create', element: <StockOperationCreatePage /> },
            { path: 'stock-operation/:id', element: <StockOperationInfoPage /> },
          ],
        },
        {
          path: 'finance',
          children: [
            { path: 'payment', element: <PaymentPage /> },
            { path: 'payment/:id', element: <PaymentInfoPage /> },

            { path: 'balance-account', element: <BalanceAccountPage /> },

            { path: 'expense', element: <ExpensePage /> },
            { path: 'expense/:id', element: <ExpenseInfoPage /> },

            { path: 'expense-category', element: <ExpenseCategoryPage /> },
            { path: 'expense-category/:id', element: <ExpenseCategoryInfo /> },
          ],
        },
        {
          path: 'good',
          children: [
            { path: 'good', element: <GoodPage /> },
            { path: 'good/:id', element: <GoodInfoPage /> },

            { path: 'good-category', element: <GoodCategoryPage /> },
            { path: 'good-category/:id', element: <GoodCategoryInfoPage /> },
          ],
        },
        {
          path: 'storehouse',
          children: [
            { element: <Navigate to="/dashboard/storehouse" replace />, index: true },
            { path: 'stock', element: <StockPage /> },
            { path: 'stock/:id', element: <StockInfoPage /> },
          ],
        },
        {
          path: 'report',
          children: [
            { element: <Navigate to="/dashboard/report" replace />, index: true },
            { path: 'daily-sell', element: <DailySellReport /> },
            { path: 'good-sell', element: <GoodSellReport /> },
            { path: 'good-purchase', element: <DailyPurchaseReport /> },
            { path: 'expense', element: <ExpenseReport /> },
            { path: 'analytics', element: <AnalyticsPage /> },
            { path: 'final-report', element: <FinalReport /> },
          ],
        },
        {
          path: 'dict',
          children: [
            { element: <Navigate to="/dashboard/dict" replace />, index: true },
            { path: 'client', element: <ClientPage /> },
            { path: 'client/:id', element: <ClientInfoPage /> },

            { path: 'supplier', element: <SupplierPage /> },
            { path: 'supplier/:id', element: <SupplierInfoPage /> },

            { path: 'cashbox', element: <PageCashier /> },
            // { path: 'six', element: <PageSix /> },
          ],
        },

        {
          path: 'report-temp',
          children: [
            { path: 'sell-operation', element: <SellReportTemplate /> },
            { path: 'stock-operation', element: <StockReportTemplate /> },
            { path: 'good-sell', element: <GoodSellReportTemplate /> },
            { path: 'purchase-good', element: <PurchaseGoodReportTemplate /> },
          ],
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
