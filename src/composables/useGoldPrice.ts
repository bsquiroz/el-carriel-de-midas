import { computed, type ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoldPriceStore } from '../stores/goldPriceStore'
import { formatCop } from '../utils/currency'
import { formatUpdatedAt } from '../utils/date'

export function useGoldPrice(): {
  price24kCop: ComputedRef<number | null>
  loading: ComputedRef<boolean>
  error: ComputedRef<string | null>
  formattedPricePerGram: ComputedRef<string | null>
  formattedUpdatedAt: ComputedRef<string | null>
  initialize: () => Promise<void>
  refresh: () => Promise<void>
} {
  const store = useGoldPriceStore()
  const { price24kCop, updatedAt, loading, error } = storeToRefs(store)

  const formattedPricePerGram = computed(() =>
    price24kCop.value === null ? null : formatCop(price24kCop.value),
  )

  const formattedUpdatedAt = computed(() =>
    updatedAt.value === null ? null : formatUpdatedAt(updatedAt.value),
  )

  return {
    price24kCop: computed(() => price24kCop.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    formattedPricePerGram,
    formattedUpdatedAt,
    initialize: () => store.initialize(),
    refresh: () => store.refreshPrice(),
  }
}
