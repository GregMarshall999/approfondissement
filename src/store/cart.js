const state = {
    userCart: new Map()
}

const getters = {
    getCart: state => {
        return Array.from(
            state.userCart, 
            ([id, count]) => ({ id, count })
        );
    }
}

const mutations = {
    addToCart: (state, payload) => {
        var count = 1;
        if(state.userCart.has(payload)) {
            count = state.userCart.get(payload) + 1;
        }

        state.userCart.set(payload, count);
    }, 
    clearCart: state => {
        state.userCart.clear();
    }, 
    removeFromCart: (state, payload) => {
        state.userCart.delete(payload);
    }
}

const actions = {
    putInCart: (context, payload) => {
        context.commit('addToCart', payload);
    }, 
    pay: context => {
        context.commit('clearCart');
    }, 
    deleteFromCart: (context, payload) => {
        context.commit('removeFromCart', payload);
    }
}

export default {
    namespaced: true,
    state, 
    getters, 
    mutations, 
    actions
}