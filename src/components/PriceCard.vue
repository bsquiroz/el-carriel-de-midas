<script setup lang="ts">
defineProps<{
  pricePerGramLabel: string | null
  updatedAtLabel: string | null
  loading: boolean
  error: string | null
}>()
</script>

<template>
  <section class="card-midas flex flex-col gap-4 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
    <p v-if="loading" class="text-midas-text/70">Cargando precio...</p>
    <p v-else-if="error" class="text-red-300">{{ error }}</p>
    <template v-else>
      <div>
        <p class="label-caps mb-1">Precio actual del oro 24K</p>
        <p class="font-display text-4xl font-semibold text-midas-gold lg:text-5xl">
          {{ pricePerGramLabel }} <span class="font-sans text-lg font-normal text-midas-text/70">COP / gramo</span>
        </p>
        <p class="mt-2 text-sm text-midas-text/60">
          Actualizado:
          <span class="text-midas-gold-light">{{ updatedAtLabel }}</span>
        </p>
      </div>
    </template>

    <div v-if="$slots.action" class="w-full lg:w-auto">
      <slot name="action" />
    </div>
  </section>
</template>
