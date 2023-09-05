import { LessThan3Days, OutOfDate } from './time';
import { SellOperationStatusEnum } from '../pages/dictionary/sell-operation.dictionary';
import { HHmmDDMMYYYY } from './formatTime';

export const PlannedPaymentColor = (payment) =>
  // eslint-disable-next-line no-nested-ternary
  payment.plannedOn
    ? // eslint-disable-next-line no-nested-ternary
      payment.plannedOn !== payment.createdAt &&
      OutOfDate(payment.plannedOn) &&
      payment.status !== SellOperationStatusEnum.conducted
      ? 'error.main'
      : // eslint-disable-next-line no-nested-ternary
      LessThan3Days(payment.plannedOn) < 0
      ? 'text.primary'
      : // eslint-disable-next-line no-nested-ternary
      payment.plannedOn !== payment.createdAt &&
        LessThan3Days(payment.plannedOn) < 3 &&
        payment.status !== SellOperationStatusEnum.conducted
      ? 'warning.main'
      : HHmmDDMMYYYY(payment.plannedOn)?.split(' ')[1] ===
        HHmmDDMMYYYY(payment.createdAt)?.split(' ')[1]
      ? 'text.primary'
      : 'info.main'
    : 'text.primary';
