export interface GoldSpotApiResponse {
  per_gram_usd: number
  fx_rates: {
    COP: number
    [currency: string]: number
  }
  updated_at: string
  [key: string]: unknown
}

export interface GoldPrice {
  price24kCop: number
  price24kUsd: number
  usdCopRate: number
  updatedAt: string
}
