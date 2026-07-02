<script setup lang="ts">
defineProps<{
  precioPorGramoLabel: string
  totalLabel: string
  isValid: boolean
}>()
</script>

<template>
  <section class="card-midas relative overflow-hidden">
    <div class="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-midas-gold/10 blur-3xl"></div>

    <p class="label-caps relative mb-4">Liquidación</p>

    <div class="relative flex flex-col divide-y divide-dashed divide-midas-gold/30 lg:grid lg:grid-cols-2 lg:divide-y-0">
      <div class="flex flex-col gap-2 pb-4 lg:pb-0 lg:pr-6">
        <span class="text-midas-text/70">Precio por gramo</span>
        <span v-if="isValid" class="text-xl font-semibold text-midas-gold">{{ precioPorGramoLabel }}</span>
        <span v-else class="inline-block h-0.5 w-8 rounded-full bg-midas-text/50"></span>
      </div>

      <div class="flex flex-col gap-2 pt-4 lg:border-l lg:border-midas-gold/20 lg:pt-0 lg:pl-6">
        <span class="text-midas-text/70">Total</span>
        <span v-if="isValid" class="text-2xl font-bold text-midas-gold">{{ totalLabel }}</span>
        <span v-else class="inline-block h-0.5 w-8 rounded-full bg-midas-gold"></span>
      </div>
    </div>

    <p v-if="!isValid" class="relative mt-4 text-sm text-midas-text/50">
      Ingresa la ley y el peso para calcular el valor de compra.
    </p>
  </section>
</template>
