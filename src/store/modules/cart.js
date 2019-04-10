import shop from '@/api/shop'

export default {
  namespaced: true,

  state: {
    // {id, quantity}
    items: [],
    checkoutStatus: null
  },

  getters: {
    cartProducts (state, getters, rootState) {
      return state.items.map(cartItem => {
        const product = rootState.products.items.find(
          product => product.id === cartItem.id
        )
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },

    cartTotal (state, getters) {
      let total = 0
      return getters.cartProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      )
    }
  },

  mutations: {
    pushProductToCart (state, product) {
      state.items.push({
        id: product.id,
        title: product.title,
        quantity: 1
      })
    },

    incrementItemQuantity (state, cartItem) {
      cartItem.quantity++
    },
    setCheckoutStatus (state, status) {
      state.checkoutStatus = status
    },

    emptyCart (state) {
      state.items = []
    }
  },

  actions: {
    checkout ({ state, commit }) {
      shop.buyProducts(
        state.items,
        () => {
          commit('emptyCart')
          commit('setCheckoutStatus', 'Success')
        },
        () => {
          commit('setCheckoutStatus', 'Fail')
        }
      )
    },

    addProductToCart (
      { commit, state, getters, rootState, rootGetters },
      product
    ) {
      const cartItem = state.items.find(item => item.id === product.id)

      if (rootGetters['products/productIsInStock'](product)) {
        // find cart item

        if (!cartItem) {
          commit('pushProductToCart', product)
        } else {
          commit('incrementItemQuantity', cartItem)
        }

        commit('products/decrementProductInventory', product, { root: true })
      }
    }
  }
}
