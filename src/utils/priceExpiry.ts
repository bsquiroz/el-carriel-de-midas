import { PRICE_TTL_MS } from '../constants/pricing.constants'

export function isExpired(updatedAt: string, ttlMs: number = PRICE_TTL_MS): boolean {
  const elapsed = Date.now() - new Date(updatedAt).getTime()
  return elapsed > ttlMs
}
