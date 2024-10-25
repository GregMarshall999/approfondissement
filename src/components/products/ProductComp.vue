<template>
    <li @click="emit('selected')">
        <slot 
            v-for="index in slotCount"
            :key="index" 
            :name="`field${index}`"
        ></slot>
        <slot></slot>
    </li>
</template>

<script setup>

const props = defineProps({
    slotCount: {
        type: Number
    }
})

const emit = defineEmits(['selected']);

</script>