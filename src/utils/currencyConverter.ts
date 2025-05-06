
// Currency conversion rates
const conversionRates: Record<CurrencyCode, Partial<Record<CurrencyCode, number>>> = {
  EUR: {
    DZD: 147.26, // Updated rate: 1 EUR = 147.26 DZD as of 2025
    USD: 1.09,   // 1 EUR = 1.09 USD
    GBP: 0.85,   // 1 EUR = 0.85 GBP
  },
  DZD: {
    EUR: 0.0068, // 1 DZD = 0.0068 EUR
    USD: 0.0074, // 1 DZD = 0.0074 USD
    GBP: 0.0058, // 1 DZD = 0.0058 GBP
  },
  USD: {
    EUR: 0.92,   // 1 USD = 0.92 EUR
    DZD: 135.11, // 1 USD = 135.11 DZD
    GBP: 0.78,   // 1 USD = 0.78 GBP
  },
  GBP: {
    EUR: 1.18,   // 1 GBP = 1.18 EUR
    DZD: 173.26, // 1 GBP = 173.26 DZD
    USD: 1.28,   // 1 GBP = 1.28 USD
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
      return `€${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    case 'DZD':
      return `${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} DZD`;
    case 'USD':
      return `$${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    case 'GBP':
      return `£${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    default:
      return `${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency}`;
  }
};
