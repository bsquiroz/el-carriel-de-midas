<script setup lang="ts">
defineProps<{
  pricePerGramLabel: string | null
  updatedAtLabel: string | null
  loading: boolean
  error: string | null
}>()
</script>

<template>
  <section class="card-midas text-center">
    <p v-if="loading" class="text-midas-text/70">Cargando precio...</p>
    <p v-else-if="error" class="text-red-300">{{ error }}</p>
    <template v-else>
      <p class="text-3xl font-semibold text-midas-gold">
        {{ pricePerGramLabel }} <span class="text-lg font-normal text-midas-text/70">COP / gramo</span>
      </p>
      <p class="mt-2 text-sm text-midas-text/60">
        Actualizado:
        <span class="text-midas-gold-light">{{ updatedAtLabel }}</span>
      </p>
    </template>
  </section>
</template>
