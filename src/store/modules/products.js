import shop from '@/api/shop'
import promise from 'core-js/es6/promise'

export default {
  namespaced: true,

  state: {
    // = data
    items: []
  },

  getters: {
    // = computed properties
    availableProducts (state, getters) {
      return state.items.filter(product => product.inventory > 0)
    },

    productIsInStock () {
      return product => {
        return product.inventory > 0
      }
    }
  },

  mutations: {
    setProducts (state, items) {
      state.items = items
    },

    decrementProductInventory (state, product) {
      product.inventory--
    }
  },
  actions: {
    // = methods
    fetchProducts ({ commit }) {
      return new promise((resolve, reject) => {
        // make the call

        shop.getProducts(items => {
          commit('setProducts', items)
          resolve()
        })
      })
    }
  }
}
