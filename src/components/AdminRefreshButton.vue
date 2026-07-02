<script setup lang="ts">
defineProps<{
  loading: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button type="button" class="btn-metallic" :disabled="loading" @click="$emit('click')">
    {{ loading ? 'Actualizando...' : 'Actualizar precio del oro' }}
  </button>
</template>
