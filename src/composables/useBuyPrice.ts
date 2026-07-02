export function calculateBuyPrice24kCop(
  internationalPrice24kCop: number,
  marketDiscountRate: number,
  profitMarginRate: number,
): number {
  const afterMarketDiscount = internationalPrice24kCop * (1 - marketDiscountRate)
  return afterMarketDiscount * (1 - profitMarginRate)
}
