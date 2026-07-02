import { computed, type ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoldPriceStore } from '../stores/goldPriceStore'
import { calculateBuyPrice24kCop } from './useBuyPrice'
import { formatCop } from '../utils/currency'
import { formatUpdatedAt } from '../utils/date'

export function useGoldPrice(): {
  price24kCop: ComputedRef<number | null>
  buyPrice24kCop: ComputedRef<number | null>
  loading: ComputedRef<boolean>
  error: ComputedRef<string | null>
  formattedInternationalPricePerGram: ComputedRef<string | null>
  formattedBuyPricePerGram: ComputedRef<string | null>
  formattedUpdatedAt: ComputedRef<string | null>
  initialize: () => Promise<void>
  refresh: () => Promise<void>
} {
  const store = useGoldPriceStore()
  const { price24kCop, updatedAt, loading, error } = storeToRefs(store)

  const buyPrice24kCop = computed(() =>
    price24kCop.value === null ? null : calculateBuyPrice24kCop(price24kCop.value),
  )

  const formattedInternationalPricePerGram = computed(() =>
    price24kCop.value === null ? null : formatCop(price24kCop.value),
  )

  const formattedBuyPricePerGram = computed(() =>
    buyPrice24kCop.value === null ? null : formatCop(buyPrice24kCop.value),
  )

  const formattedUpdatedAt = computed(() =>
    updatedAt.value === null ? null : formatUpdatedAt(updatedAt.value),
  )

  return {
    price24kCop: computed(() => price24kCop.value),
    buyPrice24kCop,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    formattedInternationalPricePerGram,
    formattedBuyPricePerGram,
    formattedUpdatedAt,
    initialize: () => store.initialize(),
    refresh: () => store.refreshPrice(),
  }
}
