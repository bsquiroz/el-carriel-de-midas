<script setup lang="ts">
import GoldCalculator from './components/GoldCalculator.vue'
</script>

<template>
  <main class="flex min-h-screen w-full items-center justify-center bg-midas-bg px-4 py-12 text-midas-text">
    <div class="flex w-full max-w-md flex-col items-center gap-4 lg:max-w-3xl">
      <div class="flex items-center gap-3">
        <span class="h-px w-8 bg-midas-gold/40"></span>
        <span class="label-caps">Joyería premium</span>
        <span class="h-px w-8 bg-midas-gold/40"></span>
      </div>

      <h1
        class="bg-gradient-to-b from-midas-gold to-midas-gold-light bg-clip-text text-center
               font-display text-4xl font-semibold text-transparent lg:text-6xl"
      >
        El carriel de midas
      </h1>

      <p class="text-center text-sm text-midas-text/70 lg:text-base">
        Calcula el valor de compra del oro en tiempo real
      </p>

      <GoldCalculator class="mt-4 w-full" />
    </div>
  </main>
</template>
