export const PaymentStatusEnum = {
  planned: 'PLANNED',
  conducted: 'CONDUCTED',
};

export const PaymentStatusDict = [
  {
    name: 'Запланирован',
    value: PaymentStatusEnum.planned,
  },
  {
    name: 'Проведен',
    value: PaymentStatusEnum.conducted,
  },
];

export const PaymentTypeEnum = {
  buy: 'BUY',
  sell: 'SELL',
  debitPayOff: 'DEBIT-PAY-OFF',
  creditPayOff: 'CREDIT-PAY-OFF',
};

export const PaymentTypeEnumRu = {
  buy: 'Закуп',
  sell: 'Продажа',
  'debit-pay-off': 'Погашение долга клиента',
  'credit-pay-off': 'Погашение долга поставщика',
};

export const SpecPaymentTypeDict = [
  {
    name: 'Погашение долга клиента',
    value: PaymentTypeEnum.debitPayOff,
  },
  {
    name: 'Погашение долга поставщика',
    value: PaymentTypeEnum.creditPayOff,
  },
];

export const PaymentTypeDict = [
  {
    name: 'Продажа',
    value: PaymentTypeEnum.sell,
  },
  {
    name: 'Закуп',
    value: PaymentTypeEnum.buy,
  },
  {
    name: 'Погашение долга клиента',
    value: PaymentTypeEnum.debitPayOff,
  },
  {
    name: 'Погашение долга поставщика',
    value: PaymentTypeEnum.creditPayOff,
  },
];
