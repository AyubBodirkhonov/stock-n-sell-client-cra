export function formatAccountNumber(accountNumber) {
  if (!accountNumber) return '';
  return `000${accountNumber[0]} ${accountNumber.slice(1, 5)} ${accountNumber.slice(
    5,
    9
  )} ${accountNumber.slice(9, 13)}`;
}

export function formatPhoneUI(phone) {
  return `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 8)} ${phone.slice(
    8,
    10
  )} ${phone.slice(10, 12)}`;
}
