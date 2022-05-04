<template>
  <a :href="href" target="_blank" rel="noopener noreferrer"
    ><slot></slot> <i class="fas fa-external-link-alt fa-sm"></i
  ></a>
</template>

<script lang="ts" setup>
defineProps<{ href: string }>();
</script>
