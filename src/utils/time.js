const WARNING_DAYS = 3;

export const LessThan3Days = (date) =>
  Math.round(
    (100 * (Date.now() + WARNING_DAYS * 24 * 3600 * 1000 - new Date(date).getTime())) /
      (WARNING_DAYS * 24 * 3600 * 1000)
  ) / 100;

export const OutOfDate = (date) => new Date(date).getTime() - Date.now() < 0;
