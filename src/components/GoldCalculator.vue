<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useGoldPrice } from '../composables/useGoldPrice'
import { useGoldCalculator } from '../composables/useGoldCalculator'
import { useAdminMode } from '../composables/useAdminMode'
import { formatCop } from '../utils/currency'
import PriceCard from './PriceCard.vue'
import GoldCalculatorForm from './GoldCalculatorForm.vue'
import ResultCard from './ResultCard.vue'
import AdminRefreshButton from './AdminRefreshButton.vue'
import AdminPricingControls from './AdminPricingControls.vue'

const leyRaw = ref('')
const gramosRaw = ref('')

const {
  buyPrice24kCop,
  loading,
  error,
  formattedInternationalPricePerGram,
  formattedBuyPricePerGram,
  formattedUpdatedAt,
  initialize,
  refresh,
} = useGoldPrice()

const { isAdmin } = useAdminMode()

const { leyValidation, gramosValidation, isValid, result } = useGoldCalculator(
  leyRaw,
  gramosRaw,
  buyPrice24kCop,
)

const precioPorGramoLabel = computed(() => formatCop(result.value.precioPorGramo))
const totalLabel = computed(() => formatCop(result.value.total))

const formDisabled = computed(() => buyPrice24kCop.value === null || loading.value)

onMounted(() => {
  initialize()
})
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <PriceCard
      :price-per-gram-label="formattedBuyPricePerGram"
      :international-price-label="formattedInternationalPricePerGram"
      :updated-at-label="formattedUpdatedAt"
      :loading="loading"
      :error="error"
    >
      <template v-if="isAdmin" #action>
        <AdminRefreshButton :loading="loading" @click="refresh" />
      </template>
    </PriceCard>

    <AdminPricingControls v-if="isAdmin" />

    <GoldCalculatorForm
      v-model:ley="leyRaw"
      v-model:gramos="gramosRaw"
      :ley-error="leyValidation.message"
      :gramos-error="gramosValidation.message"
      :disabled="formDisabled"
    />

    <ResultCard
      :precio-por-gramo-label="precioPorGramoLabel"
      :total-label="totalLabel"
      :is-valid="isValid"
    />
  </div>
</template>
