import { parseHalfPrice } from "@/helper/ProductHelper";
import { createProduct, deleteProduct, findProducts, updateProduct } from "@/services/productService";

const state = {
    //test avec 20.11 test avec 500.2 test 2000.1
    products: [], 
    sales: false
}

const getters = {
    getProducts: (state, getters, rootState, rootGetters) => {
        if(!state.sales) {
            return state.products;
        }

        var soldes = state.products.map(p => {
            return {
                id: p.id,
                name: `**${p.name}**`, 
                price: parseHalfPrice(p.price)
            }
        });
    
        return soldes;
    }, 
    getProduct: state => payload => {
        return state.products[payload];
    }, 
    getDisplayProduct: state => payload => {
        const prod = state.products.filter(p => p.id == payload);

        if(prod.length == 1) {
            return {
                id: prod[0].id,
                name: prod[0].name, 
                price: state.sales ? parseHalfPrice(prod[0].price) : prod[0].price
            }
        }
    },
    findProductPrice: state => payload => {
        const cost = state.products.filter(p => {
            if(p.name == payload) {
                return p;
            }
        });

        if(cost.length == 1) {
            if(state.sales) {
                return parseHalfPrice(cost[0].price);
            }
            else {
                return cost[0].price;
            }
        }
    }
}

const mutations = {
    setSales: (state, payload) => {
        state.sales = payload;
    }, 
    setProducts: (state, payload) => {
        state.products = payload;
    }
}

const actions = {
    updateSales: (context, payload) => {
        setTimeout(() => context.commit('setSales', payload)), 500
    }, 
    loadProducts: context => {
        findProducts()
            .then(res => {
                context.commit('setProducts', res.data);
            })
            .catch(error => {
                console.error('Error loading Products', error);
            })
    },
    updateProduct: (context, payload) => {
        console.log(payload)

        updateProduct(payload.id, payload).then(res => {
            if(res.status == 200) {
                context.dispatch('loadProducts');
            }
        })
    }, 
    augmentPrice: async (context, payload) => {
        const prods = context.getters.getProducts.map(p => {
            return {
                id: p.id, 
                name: p.name, 
                price: p.price
            }
        });

        for(var p of prods) {
            p.price += payload;
            await updateProduct(p.id, p);
        }

        context.dispatch('loadProducts');
    },
    reduicePrice: async (context, payload) => {
        const prods = context.getters.getProducts.map(p => {
            return {
                id: p.id, 
                name: p.name, 
                price: p.price
            }
        });

        for(var p of prods) {
            p.price -= payload;
            await updateProduct(p.id, p);
        }

        context.dispatch('loadProducts');
    }, 
    removeProduct: (context, payload) => {
        deleteProduct(payload).then(res => {
            if(res.status == 200) {
                context.dispatch('loadProducts');
                context.dispatch('cart/deleteFromCart', payload, { root: true })
            }
        });
    }, 
    addProduct: (context, payload) => {
        const prod = {
            name: payload.name, 
            price: payload.price
        }

        createProduct(prod).then(res => {
            if(res.status == 201) {
                context.dispatch('loadProducts');
            }
        })
    }
}

export default {
    namespaced: true,
    state, 
    getters, 
    mutations, 
    actions
}