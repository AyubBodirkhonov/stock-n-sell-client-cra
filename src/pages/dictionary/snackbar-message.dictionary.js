export const SnackbarMessage = {
  success: {
    login: 'Аутентификация прошла успешно',
    sellOperationAdded: 'Операция создана успешно',
    paymentAdded: 'Платеж добавлен успешно',
    goodAdded: 'Товар создан успешно',
    goodCategoryAdded: 'Товарная категория создана успешно',
    clientAdded: 'Товарная категория создана успешно',
    supplierAdded: 'Товарная категория создана успешно',
    goodTransferAdded: 'Трансфер товара между складами прошла успешно',
  },
  error: {
    unexpectedError: 'Непредвиденная ошибка, повторите попытку позже',
    unauthorized: 'Ошибка авторизации или токена',
    roles: 'Недосточно прав для совершения этой операции, обратитесь к системному администратору',
    login: 'Ошибка! Проверьте ваши данные и повторите попытку',
    tokenNotFound: 'Срок токена истек или токен не найден! Авторизуйтесь заново',
    leftToPayLowerThanZero: 'Остаток платежа меньше чем платеж',
    goodLeftAmount: 'Остаток товара на складе меньше чем указно в операции',
    paymentAmountBiggerThanTotalPrice: 'Сумма платежа больше чем сумма операции',
    paymentAmountBiggerThanLeftToPay: 'Сумма платежа больше чем сумма задолжности операции',
    operationNotFound: 'Операция не найдена',
    paymentNotFound: 'Платеж не найден',
    invalidFields: 'Ваши данные не валидны! Проверьте правильность заполненных полей',
    stockAmountLessThanTransferAmount:
      'Количество товара на указаном складе меньше чем количество трансфера',
    stockLeftAmountError: 'Количество товара на складе меньше чем указанное количество',
  },
  info: {
    sellItemAdded: 'Товар добавлен в список',
  },
  warning: {
    sellItemRemoved: 'Товар удален со списка',
    tokenExpired: 'Срок действия токена истек',
  },
};

export const SnackbarType = {
  info: 'info',
  warning: 'warning',
  error: 'error',
  success: 'success',
};
