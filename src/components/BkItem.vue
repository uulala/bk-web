<template>
    <text :class="`bk-icon bk-${iconName}`"></text>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = withDefaults(defineProps<{
    iconName: string
}>(), { iconName: 'bk-tongxunfei' })

</script>

<style lang="scss" scoped>
</style>
