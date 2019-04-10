import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'
import promise from 'core-js/es6/promise'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // = data
    products: [],
    // {id, quantity}
    cart: [],
    checkoutStatus: null
  },

  getters: {
    // = computed properties
    availableProducts (state, getters) {
      return state.products.filter(product => product.inventory > 0)
    },

    cartProducts (state) {
      return state.cart.map(cartItem => {
        const product = state.products.find(
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
    },

    productIsInStock () {
      return product => {
        return product.inventory > 0
      }
    }
  },

  actions: {
    // = methods
    fetchProducts (context) {
      return new promise((resolve, reject) => {
        // make the call

        shop.getProducts(products => {
          context.commit('setProducts', products)
          resolve()
        })
      })
    },

    checkout ({ state, commit }) {
      shop.buyProducts(
        state.cart,
        () => {
          commit('emptyCart')
          commit('setCheckoutStatus', 'Success')
        },
        () => {
          commit('setCheckoutStatus', 'Fail')
        }
      )
    },

    addProductToCart ({ commit, state, getters }, product) {
      const cartItem = state.cart.find(item => item.id === product.id)

      if (getters.productIsInStock(product)) {
        // find cart item

        if (!cartItem) {
          commit('pushProductToCart', product)
        } else {
          console.log(
            cartItem.id + ' / ' + cartItem.title + ' / ' + cartItem.quantity
          )
          commit('incrementItemQuantity', cartItem)
        }

        commit('decrementProductInventory', product)
      }
    }
  },

  mutations: {
    setProducts (state, products) {
      state.products = products
    },

    pushProductToCart (state, product) {
      state.cart.push({
        id: product.id,
        title: product.title,
        quantity: 1
      })
    },

    incrementItemQuantity (state, cartItem) {
      cartItem.quantity++
    },

    decrementProductInventory (state, product) {
      product.inventory--
    },

    setCheckoutStatus (state, status) {
      state.checkoutStatus = status
    },

    emptyCart (state) {
      state.cart = []
    }
  }
})
