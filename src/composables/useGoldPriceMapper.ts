import type { GoldPrice, GoldSpotApiResponse } from '../types/gold-price.types'

export function calculateGoldPrice24kCop(perGramUsd: number, usdCopRate: number): number {
  return perGramUsd * usdCopRate
}

export function mapSpotResponseToGoldPrice(response: GoldSpotApiResponse): GoldPrice {
  const perGramUsd = response.per_gram_usd
  const usdCopRate = response.fx_rates.COP

  return {
    price24kCop: calculateGoldPrice24kCop(perGramUsd, usdCopRate),
    price24kUsd: perGramUsd,
    usdCopRate,
    updatedAt: response.updated_at,
  }
}
