// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_label'),
  home: icon('ic_menu_item'),
  operation: icon('ic_external'),
  storehouse: icon('ic_file'),
  finance: icon('ic_invoice'),
  good: icon('ic_cart'),
  analytics: icon('ic_analytics'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Менеджмент',
    items: [
      { title: 'Главная', path: PATH_DASHBOARD.home, icon: ICONS.home },
      {
        title: 'Операции',
        path: PATH_DASHBOARD.operation.root,
        icon: ICONS.operation,
        children: [
          { title: 'Продажи', path: PATH_DASHBOARD.operation.sellOperation },
          { title: 'Закупы', path: PATH_DASHBOARD.operation.stockOperation },
        ],
      },
      {
        title: 'Финансы',
        path: PATH_DASHBOARD.finance.root,
        icon: ICONS.finance,
        children: [
          { title: 'Платежи', path: PATH_DASHBOARD.finance.payment },
          { title: 'Балансные счета', path: PATH_DASHBOARD.finance.balanceAccount },
          { title: 'Категория расходов', path: PATH_DASHBOARD.finance.expenseCategory },
          { title: 'Список расходов', path: PATH_DASHBOARD.finance.expense },
        ],
      },
      {
        title: 'Склад',
        path: PATH_DASHBOARD.storehouse.root,
        icon: ICONS.storehouse,
        children: [{ title: 'Склады', path: PATH_DASHBOARD.storehouse.stock }],
      },
      {
        title: 'Товар',
        path: PATH_DASHBOARD.good.root,
        icon: ICONS.good,
        children: [
          { title: 'Товары', path: PATH_DASHBOARD.good.good },
          { title: 'Категории товаров', path: PATH_DASHBOARD.good.goodCategory },
        ],
      },
      {
        title: 'Отчеты',
        path: PATH_DASHBOARD.report.root,
        icon: ICONS.analytics,
        children: [
          { title: 'Дневные продажи', path: PATH_DASHBOARD.report.dailySells },
          { title: 'По продаже товаров', path: PATH_DASHBOARD.report.goodSells },
          { title: 'По покупке товаров', path: PATH_DASHBOARD.report.goodPurchase },
          { title: 'По расходам', path: PATH_DASHBOARD.report.expense },
          { title: 'Аналитика', path: PATH_DASHBOARD.report.analytics },
          { title: 'Общий отчет', path: PATH_DASHBOARD.report.finalReport },
        ],
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Общие',
    items: [
      {
        title: 'Словари',
        path: PATH_DASHBOARD.dict.root,
        icon: ICONS.user,
        children: [
          { title: 'Клиенты', path: PATH_DASHBOARD.dict.client },
          { title: 'Поставщики', path: PATH_DASHBOARD.dict.supplier },
          { title: 'Касса', path: PATH_DASHBOARD.dict.cashbox },
          // { title: 'Six', path: PATH_DASHBOARD.dict.six },
        ],
      },
    ],
  },
];

export default navConfig;
