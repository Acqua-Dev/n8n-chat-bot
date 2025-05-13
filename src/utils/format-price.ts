export default function formatPrice(
  locale: string,
  currency: string,
  amount: number,
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);
}
