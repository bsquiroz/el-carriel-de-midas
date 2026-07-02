import { defineStore } from 'pinia'
import { fetchGoldSpotPrice } from '../services/goldPriceService'
import { mapSpotResponseToGoldPrice } from '../composables/useGoldPriceMapper'
import { readFromStorage, writeToStorage } from '../utils/storage'
import { isExpired } from '../utils/priceExpiry'
import { GOLD_PRICE_STORAGE_KEY } from '../constants/storage.constants'
import type { GoldPrice } from '../types/gold-price.types'

interface GoldPriceState {
  price24kCop: number | null
  price24kUsd: number | null
  usdCopRate: number | null
  updatedAt: string | null
  loading: boolean
  error: string | null
}

export const useGoldPriceStore = defineStore('goldPrice', {
  state: (): GoldPriceState => ({
    price24kCop: null,
    price24kUsd: null,
    usdCopRate: null,
    updatedAt: null,
    loading: false,
    error: null,
  }),

  actions: {
    async initialize(): Promise<void> {
      const cached = readFromStorage<GoldPrice>(GOLD_PRICE_STORAGE_KEY)

      if (cached && !isExpired(cached.updatedAt)) {
        this.hydrate(cached)
        return
      }

      await this.fetchAndPersist()
    },

    async refreshPrice(): Promise<void> {
      await this.fetchAndPersist()
    },

    hydrate(price: GoldPrice): void {
      this.price24kCop = price.price24kCop
      this.price24kUsd = price.price24kUsd
      this.usdCopRate = price.usdCopRate
      this.updatedAt = price.updatedAt
    },

    async fetchAndPersist(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response = await fetchGoldSpotPrice()
        const price = mapSpotResponseToGoldPrice(response)
        this.hydrate(price)
        writeToStorage(GOLD_PRICE_STORAGE_KEY, price)
      } catch {
        this.error = 'No se pudo obtener el precio del oro. Intenta recargar la página.'
      } finally {
        this.loading = false
      }
    },
  },
})
