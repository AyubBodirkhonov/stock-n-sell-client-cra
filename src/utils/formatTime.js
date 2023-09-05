import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

// 2023-06-01T17:39:12.404Z => 17:39 2023-06-01
export function HHmmDDMMYYYY(time) {
  if (time) {
    const YYYYMMdd = time.split('T')[0];
    const hhmmss = time.split('T')[1].split('.')[0];
    // const date = new Date(time);
    const hours = hhmmss.split(':')[0];
    const minutes = hhmmss.split(':')[1];
    const day = YYYYMMdd.split('-')[2];
    const month = YYYYMMdd.split('-')[1]; // Note: January is 0 in JavaScript Date
    const year = YYYYMMdd.split('-')[0];

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
  return ''; // Return an empty string or a default value when the input is undefined
}

export function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}
