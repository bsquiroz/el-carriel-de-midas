import { MARKET_DISCOUNT_RATE, PROFIT_MARGIN_RATE } from '../constants/pricing.constants'

export function calculateBuyPrice24kCop(internationalPrice24kCop: number): number {
  const afterMarketDiscount = internationalPrice24kCop * (1 - MARKET_DISCOUNT_RATE)
  return afterMarketDiscount * (1 - PROFIT_MARGIN_RATE)
}
