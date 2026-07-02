import { defineStore } from 'pinia'
import { MARKET_DISCOUNT_RATE, PROFIT_MARGIN_RATE } from '../constants/pricing.constants'

interface PricingConfigState {
  marketDiscountRate: number
  profitMarginRate: number
}

// Deliberadamente sin LocalStorage: los ajustes del admin son solo para la
// sesión actual y vuelven a los defaults de pricing.constants.ts al recargar.
export const usePricingConfigStore = defineStore('pricingConfig', {
  state: (): PricingConfigState => ({
    marketDiscountRate: MARKET_DISCOUNT_RATE,
    profitMarginRate: PROFIT_MARGIN_RATE,
  }),

  actions: {
    setMarketDiscountRate(rate: number): void {
      this.marketDiscountRate = rate
    },

    setProfitMarginRate(rate: number): void {
      this.profitMarginRate = rate
    },
  },
})
