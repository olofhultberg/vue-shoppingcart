<template>
  <div>
    <h1>Shopping Cart</h1>
    <ul>
      <li v-for="product in products">
        {{product.title}} - {{product.price | currency }} - {{product.quantity}}

      </li>
      <hr>
      <p>Total: {{ total | currency }}</p>
      <div v-if="total > 0">
        <button @click="checkout">Checkout</button>
      </div>

      <p v-if="checkoutStatus">{{checkoutStatus}}</p>

    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters("cart", {
      products: "cartProducts",
      total: "cartTotal"
    }),

    ...mapState("cart", {
      checkoutStatus: state => state.checkoutStatus
    })
  },

  methods: {
    ...mapActions("cart", ["checkout"])
  }
};
</script>
