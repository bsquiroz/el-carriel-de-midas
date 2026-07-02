<script setup lang="ts">
import GoldCalculator from './components/GoldCalculator.vue'
</script>

<template>
  <main class="flex min-h-screen w-full items-center justify-center bg-midas-bg px-4 py-12 text-midas-text">
    <div class="flex w-full max-w-md flex-col items-center gap-4 lg:max-w-3xl">
      <img src="/logo.png" alt="El carriel de midas — Joyería premium" class="w-48 lg:w-64" />

      <p class="text-center text-sm text-midas-text/70 lg:text-base">
        Calcula el valor de compra del oro en tiempo real
      </p>

      <GoldCalculator class="mt-4 w-full" />
    </div>
  </main>
</template>
