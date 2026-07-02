<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  hint?: string
  placeholder?: string
  error?: string | null
  inputmode?: 'numeric' | 'decimal'
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="flex flex-col gap-1.5 text-left">
    <span class="flex items-baseline justify-between gap-2">
      <span class="label-caps">{{ label }}</span>
      <span v-if="hint" class="text-xs text-midas-text/50">{{ hint }}</span>
    </span>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :inputmode="inputmode"
      :disabled="disabled"
      class="rounded-md border border-midas-gold/30 bg-midas-bg/60 px-3 py-2 text-midas-text
             placeholder:text-midas-text/40 outline-none transition
             focus:border-midas-gold focus:ring-1 focus:ring-midas-gold
             disabled:opacity-50 disabled:cursor-not-allowed"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="text-sm text-red-300">{{ error }}</span>
  </label>
</template>
