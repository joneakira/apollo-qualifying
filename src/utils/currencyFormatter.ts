/**
 * Converts and formats a number to a currency string.
 * @param value - The numeric value to be formatted.
 * @param currency - The currency code (e.g., 'USD', 'EUR', 'BRL').
 * @param locale - The locale code (e.g., 'en-US', 'pt-BR').
 * @returns The value formatted as a currency string.
 */
export function currencyFormatter(
  value: number | undefined,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    value ?? 0
  );
}
