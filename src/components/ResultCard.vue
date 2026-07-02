<script setup lang="ts">
defineProps<{
  precioPorGramoLabel: string
  totalLabel: string
  isValid: boolean
}>()
</script>

<template>
  <section class="card-midas flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="text-midas-text/70">Precio por gramo</span>
      <span class="text-xl font-semibold text-midas-gold">
        {{ isValid ? precioPorGramoLabel : '--' }}
      </span>
    </div>
    <hr class="border-midas-gold/20" />
    <div class="flex items-center justify-between">
      <span class="text-midas-text/70">Total</span>
      <span class="text-2xl font-bold text-midas-gold">
        {{ isValid ? totalLabel : '--' }}
      </span>
    </div>
  </section>
</template>
