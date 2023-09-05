export const SellOperationTypeEnum = {
  income: 'INCOME',
  expense: 'EXPENSE',
};

export const SellOperationStatusEnum = {
  pending: 'PENDING',
  approved: 'APPROVED',
  conducted: 'CONDUCTED',
  closed: 'CLOSED',
  cancelled: 'CANCELLED',
  planned: 'PLANNED',
};

export const SellOperationStatus = [
  {
    name: 'В ожидании',
    value: 'PENDING',
  },
  {
    name: 'Одобрен',
    value: 'APPROVED',
  },
  {
    name: 'Проведен',
    value: 'CONDUCTED',
  },
  {
    name: 'Отменен',
    value: 'CANCELLED',
  },
  {
    name: 'Закрыт',
    value: 'CLOSED',
  },
];

export const SellOperationType = [
  {
    name: 'Income',
    value: 'INCOME',
  },
  {
    name: 'Expense',
    value: 'EXPENSE',
  },
];

export const SellOperationTypeRu = {
  EXPENSE: 'Расход',
  INCOME: 'Приход',
};

export const SellOperationStatusRu = {
  PENDING: 'В ожидании',
  APPROVED: 'Одобрен',
  CONDUCTED: 'Проведен',
  CANCELLED: 'Отменен',
  CLOSED: 'Закрыт',
  PLANNED: 'Запланирован',
};
