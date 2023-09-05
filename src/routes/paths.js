// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  home: path(ROOTS_DASHBOARD, '/home'),
  admin: {
    root: path(ROOTS_DASHBOARD, '/admin'),
    logs: path(ROOTS_DASHBOARD, '/admin/log'),
    blackList: path(ROOTS_DASHBOARD, '/admin/black-list'),
    user: path(ROOTS_DASHBOARD, '/admin/user'),
    userInfo: path(ROOTS_DASHBOARD, '/admin/user/:id'),
  },
  operation: {
    root: path(ROOTS_DASHBOARD, '/operation'),
    sellOperation: path(ROOTS_DASHBOARD, '/operation/sell-operation'),
    sellOperationInfo: path(ROOTS_DASHBOARD, '/operation/sell-operation/:id'),
    sellOperationCreate: path(ROOTS_DASHBOARD, '/operation/sell-operation/create'),

    stockOperation: path(ROOTS_DASHBOARD, '/operation/stock-operation'),
    stockOperationInfo: path(ROOTS_DASHBOARD, '/operation/stock-operation/:id'),
  },

  finance: {
    root: path(ROOTS_DASHBOARD, '/finance'),

    payment: path(ROOTS_DASHBOARD, '/finance/payment'),
    paymentInfo: path(ROOTS_DASHBOARD, '/finance/payment/:id'),

    balanceAccount: path(ROOTS_DASHBOARD, '/finance/balance-account'),

    expense: path(ROOTS_DASHBOARD, '/finance/expense'),
    expenseInfo: path(ROOTS_DASHBOARD, '/finance/expense/:id'),

    expenseCategory: path(ROOTS_DASHBOARD, '/finance/expense-category'),
    expenseCategoryInfo: path(ROOTS_DASHBOARD, '/finance/expense-category/:id'),
  },

  good: {
    root: path(ROOTS_DASHBOARD, '/good'),
    good: path(ROOTS_DASHBOARD, '/good/good'),
    goodInfo: path(ROOTS_DASHBOARD, '/good/good/:id'),

    goodCategory: path(ROOTS_DASHBOARD, '/good/good-category'),
    goodCategoryInfo: path(ROOTS_DASHBOARD, '/good/good-category/:id'),
  },

  storehouse: {
    root: path(ROOTS_DASHBOARD, '/storehouse'),
    stock: path(ROOTS_DASHBOARD, '/storehouse/stock'),
    stockInfo: path(ROOTS_DASHBOARD, '/storehouse/stock/:id'),
  },

  report: {
    root: path(ROOTS_DASHBOARD, '/report'),
    dailySells: path(ROOTS_DASHBOARD, '/report/daily-sell'),
    goodSells: path(ROOTS_DASHBOARD, '/report/good-sell'),
    goodPurchase: path(ROOTS_DASHBOARD, '/report/good-purchase'),
    expense: path(ROOTS_DASHBOARD, '/report/expense'),
    analytics: path(ROOTS_DASHBOARD, '/report/analytics'),
    finalReport: path(ROOTS_DASHBOARD, '/report/final-report'),
  },

  dict: {
    root: path(ROOTS_DASHBOARD, '/dict'),
    client: path(ROOTS_DASHBOARD, '/dict/client'),
    clientInfo: path(ROOTS_DASHBOARD, '/dict/client/:id'),

    supplier: path(ROOTS_DASHBOARD, '/dict/supplier'),
    supplierInfo: path(ROOTS_DASHBOARD, '/dict/supplier/:id'),

    cashbox: path(ROOTS_DASHBOARD, '/dict/cashbox'),
    // six: path(ROOTS_DASHBOARD, '/dict/six'),
  },
};
