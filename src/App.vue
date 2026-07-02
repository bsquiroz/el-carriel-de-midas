<script setup lang="ts">
import GoldCalculator from './components/GoldCalculator.vue'
</script>

<template>
  <main class="flex min-h-screen w-full items-center justify-center bg-midas-bg px-4 py-10 text-midas-text">
    <div class="flex w-full max-w-md flex-col items-center gap-8">
      <h1 class="text-2xl font-bold tracking-wide text-midas-gold">El carriel de midas</h1>
      <GoldCalculator />
    </div>
  </main>
</template>
