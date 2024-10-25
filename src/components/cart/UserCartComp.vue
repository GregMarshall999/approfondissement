<template>
    <div>
        <h3>Panier</h3>

        <span v-show="cart.length > 0">Total: {{ total }}€</span>

        <ul>
            <li v-for="cartItem in cart">
                <span>{{ cartItem.name }}</span>
                <span>x{{ cartItem.count }}</span>
                <span>Article: {{ cartItem.cost }}€</span>
            </li>
        </ul>

        <button 
            v-show="cart.length > 0"
            @click="store.dispatch('cart/pay')"
        >
            Payer
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const cart = computed(() => {
    const storeCart = store.getters['cart/getCart'];

    return storeCart.map(item => {
        const prod = store.getters['product/getDisplayProduct'](item.id);

        return {
            name: prod.name, 
            count: item.count, 
            cost: prod.price*item.count
        }
    })
})

const total = computed(() => {
    var value = 0;

    cart.value.forEach(item => value += item.cost);

    return value;
})

</script>

<style scoped>

li {
    display: flex;
    gap: 1em;
}

</style>