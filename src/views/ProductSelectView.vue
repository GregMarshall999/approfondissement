<template>
    <div class="viewer" ref="productMouse">
        <h2>Produits disponibles</h2>

        <div style="display: flex; gap: 10%;">
            <ListerComp
                style="width: 50%;" 
                :entity-list="'product'"
                @entity-selected="addToCart"
            />
            <UserCartComp/>
        </div>
        <p>x:{{ x }} | y:{{ y }}</p>
    </div>
</template>

<script setup>
import UserCartComp from '@/components/cart/UserCartComp.vue';
import ListerComp from '@/components/ListerComp.vue';
import { useMouse } from '@/composables/mouse';
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const addToCart = index => {
    const product = store.getters['product/getProduct'](index);

    if(product) {
        store.dispatch('cart/putInCart', product.id);
    }
}

const productMouse = ref(null);
const { x, y } = useMouse(productMouse);
</script>

<style>

.viewer {
    background: #0c3772c2;
    box-shadow: 1px 2px 3px rgba(0,0,0,0.2);
    margin-bottom: 30px;
    padding: 10px 20px;
    color: white;
}

</style>