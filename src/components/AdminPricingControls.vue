<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseInput from './BaseInput.vue'
import { usePricingConfig } from '../composables/usePricingConfig'
import { validatePercentage } from '../utils/validators'

const { marketDiscountRate, profitMarginRate, setMarketDiscountRate, setProfitMarginRate } =
  usePricingConfig()

function toPercentString(rate: number): string {
  return String(rate * 100).replace('.', ',')
}

const marketDiscountRaw = ref(toPercentString(marketDiscountRate.value))
const profitMarginRaw = ref(toPercentString(profitMarginRate.value))

const marketDiscountValidation = computed(() => validatePercentage(marketDiscountRaw.value))
const profitMarginValidation = computed(() => validatePercentage(profitMarginRaw.value))

function onMarketDiscountInput(value: string): void {
  marketDiscountRaw.value = value
  const validation = validatePercentage(value)
  if (validation.valid) {
    setMarketDiscountRate(parseFloat(value.replace(',', '.')) / 100)
  }
}

function onProfitMarginInput(value: string): void {
  profitMarginRaw.value = value
  const validation = validatePercentage(value)
  if (validation.valid) {
    setProfitMarginRate(parseFloat(value.replace(',', '.')) / 100)
  }
}
</script>

<template>
  <section class="card-midas flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
    <p class="label-caps lg:col-span-2">Ajustes de precio (admin)</p>
    <BaseInput
      :model-value="marketDiscountRaw"
      label="Descuento de mercado"
      hint="% (0-100)"
      placeholder="Ej: 10"
      inputmode="decimal"
      :error="marketDiscountValidation.message"
      @update:model-value="onMarketDiscountInput"
    />
    <BaseInput
      :model-value="profitMarginRaw"
      label="Margen de ganancia"
      hint="% (0-100)"
      placeholder="Ej: 10"
      inputmode="decimal"
      :error="profitMarginValidation.message"
      @update:model-value="onProfitMarginInput"
    />
  </section>
</template>
