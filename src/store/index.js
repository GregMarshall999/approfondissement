import { parseHalfPrice } from "@/helper/ProductHelper";
import { createStore } from "vuex"

const state = {
    products: [
        { name: 'Bananes', price: 1 }, //test avec 20.11 test avec 500.2 test 2000.1
        { name: 'Pommes', price: 1 },
        { name: 'Salade', price: 3 },
        { name: 'Abricots', price: 2.33 }
    ], 
    sales: false
}

const getters = {
    getProducts: state => {
        if(!state.sales) {
            return state.products;
        }

        var soldes = state.products.map(p => {
            return {
                name: `**${p.name}**`, 
                price: parseHalfPrice(p.price)
            }
        });
    
        return soldes;
    }, 
    getProduct: state => payload => {
        return state.products[payload];
    }
}

const mutations = {
    augmentPrice: (state, payload) => {
        state.products.forEach(p => {
            p.price += payload;
        });
    },
    reduicePrice: state => {
        for(var p of state.products) {
            var red = p.price - 1;
            red < 0 ? p.price = 0 : p.price = red;
        }
    }, 
    setSales: (state, payload) => {
        state.sales = payload;
    }, 
    setProduct: (state, payload) => {
        state.products[payload.index] = payload.product;
    }, 
    deleteProduct: (state, payload) => {
        state.products.splice(payload, 1);
    }
}

const actions = {
    augmentPrice: (context, payload) => {
        setTimeout(() => {
            context.commit('augmentPrice', payload);
        }, 1500);
    },
    reduicePrice: context => {
        setTimeout(() => {
            context.commit('reduicePrice'); //appelle la mutation reduicePrice
        }, 2000);
    }, 
    updateSales: (context, payload) => {
        setTimeout(() => context.commit('setSales', payload)), 500
    }, 
    updateProduct: (context, payload) => {
        setTimeout(() => {
            context.commit('setProduct', payload);
        }, 500);
    }, 
    removeProduct: (context, payload) => {
        setTimeout(() => context.commit('deleteProduct', payload), 500);
    }
}

const store = createStore({
    strict: true, 
    state, 
    getters, 
    mutations, 
    actions
});

export default store;