import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePricingConfigStore } from '../stores/pricingConfigStore'

export function usePricingConfig(): {
  marketDiscountRate: Ref<number>
  profitMarginRate: Ref<number>
  setMarketDiscountRate: (rate: number) => void
  setProfitMarginRate: (rate: number) => void
} {
  const store = usePricingConfigStore()
  const { marketDiscountRate, profitMarginRate } = storeToRefs(store)

  return {
    marketDiscountRate,
    profitMarginRate,
    setMarketDiscountRate: (rate: number) => store.setMarketDiscountRate(rate),
    setProfitMarginRate: (rate: number) => store.setProfitMarginRate(rate),
  }
}
