import { GOLD_SPOT_ENDPOINT, GOLD_SPOT_QUERY } from '../constants/api.constants'
import type { GoldSpotApiResponse } from '../types/gold-price.types'

export async function fetchGoldSpotPrice(): Promise<GoldSpotApiResponse> {
  const url = new URL(GOLD_SPOT_ENDPOINT)
  for (const [key, value] of Object.entries(GOLD_SPOT_QUERY)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`No se pudo obtener el precio del oro (status ${response.status}).`)
  }

  return (await response.json()) as GoldSpotApiResponse
}
