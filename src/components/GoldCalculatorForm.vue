<script setup lang="ts">
import BaseInput from './BaseInput.vue'

defineProps<{
  ley: string
  gramos: string
  leyError: string | null
  gramosError: string | null
  disabled?: boolean
}>()

defineEmits<{
  'update:ley': [value: string]
  'update:gramos': [value: string]
}>()
</script>

<template>
  <section class="card-midas flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
    <BaseInput
      :model-value="ley"
      label="Ley del oro"
      hint="Milésimas (0-999)"
      placeholder="Ej: 750"
      inputmode="numeric"
      :error="leyError"
      :disabled="disabled"
      @update:model-value="$emit('update:ley', $event)"
    />
    <BaseInput
      :model-value="gramos"
      label="Peso"
      hint="Gramos"
      placeholder="Ej: 5,25"
      inputmode="decimal"
      :error="gramosError"
      :disabled="disabled"
      @update:model-value="$emit('update:gramos', $event)"
    />
  </section>
</template>
