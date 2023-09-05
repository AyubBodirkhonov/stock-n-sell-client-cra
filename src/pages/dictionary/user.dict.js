export const UserRole = {
  sudo: 'SUDO',
  admin: 'ADMIN',

  /* clients */
  get_client: 'GET_CLIENT',
  get_clients: 'GET_CLIENTS',
  add_client: 'ADD_CLIENT',

  /* company */
  get_company: 'GET_COMPANY',
  add_company: 'ADD_COMPANY',

  /* supplier */
  get_supplier: 'GET_SUPPLIER',
  get_suppliers: 'GET_SUPPLIERS',
  add_supplier: 'ADD_SUPPLIER',

  /* GOOD and GOOD-CATEGORY */
  get_good: 'GET_GOOD',
  get_goods: 'GET_GOODS',
  add_good: 'ADD_GOODS',
  transferGood: 'TRANSFER_GOOD',

  get_good_category: 'GET_GOOD_CATEGORY',
  get_good_categories: 'GET_GOOD_CATEGORIES',
  add_good_category: 'ADD_GOOD_CATEGORY',

  /* PAYMENT */
  get_payment: 'GET_PAYMENT',
  get_payments: 'GET_PAYMENTS',
  add_payment: 'ADD_PAYMENTS',
  update_payment: 'UPDATE_PAYMENT',

  /* SELL-OPERATION */
  get_sell_operation: 'GET_SELL_OPERATION',
  get_sell_operations: 'GET_SELL_OPERATIONS',
  add_sell_operations: 'ADD_SELL_OPERATIONS',
  cancels_sell_operations: 'CANCEL_SELL_OPERATIONS',

  /* STOCK */
  getStock: 'GET_STOCK',
  getStocks: 'GET_STOCKS',
  addStock: 'ADD_STOCK',

  /* STOCK-OPERATION */
  getStockOperation: 'GET_STOCK_OPERATION',
  getStockOperations: 'GET_STOCK_OPERATIONS',
  addStockOperation: 'ADD_STOCK_OPERATION',
  updateStockOperationStatus: 'UPDATE_STOCK_OPERATION_STATUS',
};

export const UserRoleDict = [
  {
    name: 'Главный админ',
    description: 'Все доступы - без ограничений',
    value: 'SUDO',
  },
  {
    name: 'Админ',
    description: 'Создание новыйх пользователей, смотреть логи и черный список',
    value: 'ADMIN',
  },
  {
    name: 'Инфо о клиенте',
    description:
      'Смотреть информацию об определенном клиенте (доступ необходим для менеджера продаж)',
    value: 'GET_CLIENT',
  },
  {
    name: 'Инфо о клиентах',
    description: 'Смотреть список всех клиентов (доступ необходим для менеджера продаж)',
    value: 'GET_CLIENTS',
  },
  {
    name: 'Добавить клиента',
    description: 'Создание нового клиента (доступ необходим для менеджера продаж)',
    value: 'ADD_CLIENT',
  },
  {
    name: 'Инфо о компании',
    description: 'Информация о базовых статистиках компании',
    value: 'GET_COMPANY',
  },
  {
    name: 'Инфо о поставщике',
    description: 'Смотреть информацию об определенном поставщике (доступ необходим для кладовщика)',
    value: 'GET_SUPPLIER',
  },
  {
    name: 'Инфо о поставщиках',
    description: 'Смотреть список всех поставщиков (доступ необходим для кладовщика)',
    value: 'GET_SUPPLIERS',
  },
  {
    name: 'Добавить поставщика',
    description: 'Создание нового поставщика (доступ необходим для кладовщика)',
    value: 'ADD_SUPPLIER',
  },
  {
    name: 'Инфо о товаре',
    description:
      'Смотреть информацию об определенном товаре (доступ необходим для менеджера продаж)',
    value: 'GET_GOOD',
  },
  {
    name: 'Инфо о товарах',
    description: 'Смотреть список всех товаров (доступ необходим для менеджера продаж)',
    value: 'GET_GOODS',
  },
  {
    name: 'Добавить товара',
    description: 'Создание нового продукта (доступ необходим для кладовщика)',
    value: 'ADD_GOODS',
  },
  {
    name: 'Трансфер товара',
    description: 'Перенос товара между складами',
    value: 'TRANSFER_GOOD',
  },
  {
    name: 'Инфо о категории товаров',
    description:
      'Смотреть информацию об определенном товаре (доступ необходим для менеджера продаж)',
    value: 'GET_GOOD_CATEGORY',
  },
  {
    name: 'Инфо о категориях товаров',
    description: 'Смотреть список всех товарных категорий (доступ необходим для менеджера продаж)',
    value: 'GET_GOOD_CATEGORIES',
  },
  {
    name: 'Добавить категорию товаров',
    description: 'Создание новой категории продуктов (доступ необходим для кладовщика)',
    value: 'ADD_GOOD_CATEGORY',
  },
  {
    name: 'Инфо о платеже',
    description:
      'Смотреть информацию об определенном платеже (доступ необходим для менеджера продаж)',
    value: 'GET_PAYMENT',
  },
  {
    name: 'Инфо о платежах',
    description: 'Смотреть список всех платежей (доступ необходим для менеджера продаж)',
    value: 'GET_PAYMENTS',
  },
  {
    name: 'Добавить платеж',
    description: 'Создание нового платежа (доступ необходим для менеджера продаж)',
    value: 'ADD_PAYMENTS',
  },
  {
    name: 'Обновить платеж',
    description:
      'Обновление статуса платежа (отменить/провести) (доступ необходим для менеджера продаж)',
    value: 'UPDATE_PAYMENT',
  },
  {
    name: 'Инфо о сбыте',
    description:
      'Смотреть информацию об определенной сбыт-операции (доступ необходим для менеджера продаж)',
    value: 'GET_SELL_OPERATION',
  },
  {
    name: 'Инфо о сбытах',
    description: 'Смотреть список всех сбыт-операций (доступ необходим для менеджера продаж)',
    value: 'GET_SELL_OPERATIONS',
  },
  {
    name: 'Добавить сбыт операцию',
    description: 'Создание новой сбыт-операции (доступ необходим для менеджера продаж)',
    value: 'ADD_SELL_OPERATION',
  },
  {
    name: 'Отменять сбыт операцию',
    description: 'Отменить сбыт операцию',
    value: 'CANCEL_SELL_OPERATION',
  },
  {
    name: 'Инфо о складе',
    description: 'Смотреть информацию об определенном складе (доступ необходим для кладовщика)',
    value: 'GET_STOCK',
  },
  {
    name: 'Инфо о складах',
    description: 'Смотреть список всех складов (доступ необходим для кладовщика)',
    value: 'GET_STOCKS',
  },
  {
    name: 'Добавить склад',
    description: 'Создание нового склада (доступ необходим для кладовщика)',
    value: 'ADD_STOCK',
  },
  {
    name: 'Инфо о склад-операции',
    description:
      'Смотреть информацию об определенном склад-операции (доступ необходим для кладовщика)',
    value: 'GET_STOCK_OPERATION',
  },
  {
    name: 'Инфо о склад-операциях',
    description: 'Смотреть список всех склад-операций (доступ необходим для кладовщика)',
    value: 'GET_STOCK_OPERATIONS',
  },
  {
    name: 'Добавить склад оперцию',
    description: 'Создание новой склад-операции (доступ необходим для кладовщика)',
    value: 'ADD_STOCK_OPERATION',
  },
  {
    name: 'Обновить склад оперцию',
    description: 'Обновление статуса склад-операции (доступ необходим для кладовщика)',
    value: 'UPDATE_STOCK_OPERATION_STATUS',
  },
];
