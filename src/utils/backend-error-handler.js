export const BackendErrorHandler = (message) => {
  switch (message) {
    case 'leftToPay lower than 0':
      return 'leftToPayLowerThanZero';

    case 'good left-amount error':
      return 'goodLeftAmount';

    case 'payment amount bigger than total price of operation':
      return 'paymentAmountBiggerThanTotalPrice';

    case 'payment amount bigger than leftToPay':
      return 'paymentAmountBiggerThanLeftToPay';

    case 'operation not found':
      return 'operationNotFound';

    case 'not enough rights':
      return 'roles';

    case 'unauthorized':
      return 'unauthorized';

    case 'Forbidden resource':
      return 'roles';

    case 'stock amount less than transfer amount':
      return 'stockAmountLessThanTransferAmount';

    case 'stock left amount error':
      return 'stockLeftAmountError';

    default:
      return 'unexpectedError';
  }
};
