<template>
    <input 
        :placeholder="placeHolder"
        :type="type"
        v-model="model"
        :class="{ error : errors }"
    />
    <slot></slot>
</template>

<script setup>

const props = defineProps({
    placeHolder: {
        type: String, 
        required: true
    }, 
    type: {
        type: String, 
        required: true
    }, 
    errors: { 
        type: Boolean
    }
})

const model = defineModel();

</script>

<style scoped>

.error {
    border: solid 1px red;
}

</style>