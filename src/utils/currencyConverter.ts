
// Currency conversion rates
const conversionRates = {
  EUR: {
    DZD: 250, // 1 EUR = 250 DZD
    USD: 1.09, // 1 EUR = 1.09 USD (example)
    GBP: 0.85, // 1 EUR = 0.85 GBP (example)
  }
};

export type CurrencyCode = 'EUR' | 'DZD' | 'USD' | 'GBP';

export const formatCurrency = (
  amount: number | undefined, 
  fromCurrency: CurrencyCode = 'EUR', 
  toCurrency: CurrencyCode = 'EUR'
): string => {
  if (amount === undefined) return 'Not specified';
  
  let convertedAmount = amount;
  
  // Convert from source currency to target currency
  if (fromCurrency !== toCurrency) {
    const rate = conversionRates[fromCurrency]?.[toCurrency];
    if (rate) {
      convertedAmount = amount * rate;
    }
  }
  
  // Format based on the target currency
  switch (toCurrency) {
    case 'EUR':
      return `€${convertedAmount.toLocaleString()}`;
    case 'DZD':
      return `${convertedAmount.toLocaleString()} DZD`;
    case 'USD':
      return `$${convertedAmount.toLocaleString()}`;
    case 'GBP':
      return `£${convertedAmount.toLocaleString()}`;
    default:
      return `${convertedAmount.toLocaleString()} ${toCurrency}`;
  }
};
