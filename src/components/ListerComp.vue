<template>
    <ul :class="isAdmin ? 'admin' : 'default'">
        <ProductComp 
            v-for="(element, elementIndex) in entities"
            @selected="emit('entitySelected', elementIndex)"
            :slot-count="Object.keys(element).length - 1"
        >
            <template 
                v-for="(key, slotIndex) in noIdKeys(element)"
                #[`field${slotIndex}`]
            >
                <span :class="key">{{ parseSpanDisplay(element[key]) }}</span>
            </template>
        </ProductComp>
        <slot></slot>
    </ul>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ProductComp from './products/ProductComp.vue';

const store = useStore();

const props = defineProps({
    entityList: {
        type: String, 
        required: true
    }, 
    isAdmin: {
        type: Boolean, 
        default: false
    }
});

const entities = computed(() => getEntityList());
const noIdKeys = element => {
    return Object.keys(element).map(e => {
        if(e != 'id') {
            return e;
        }
    });
}

const getEntityList = () => {
    switch(props.entityList) {
        case 'product': 
            return store.getters['product/getProducts']
        default: 
            return [];
    }
}

const parseSpanDisplay = value => {
    switch(props.entityList) {
        case 'product':
            if(typeof value === 'number') {
                return `${value}€`;
            }
            return value;
        default: 
            return '';
    }
}

const emit = defineEmits(['entitySelected']);

</script>

<style lang="scss">
@import '../scss/ProductStyle.scss';

.admin {
    @include product-style(
        $li-display: inline-block, 
        $li-background: rgba(255, 255, 255, 0.432), 
        $li-hover-background: rgba(255, 255, 255, 0.205),
        $li-price-display: initial, 
        $li-price-color: #e8260c, 
        $li-price-marginLeft: 4px
    );
}

.default {
    @include product-style
}
</style>