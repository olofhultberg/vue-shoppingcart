/**
 * Mocking client-server processing
 */
const _products = [
  { id: 0, title: 'Rocket launcher mini', price: 52000, inventory: 4 },
  { id: 1, title: 'iPad 4 Mini', price: 500.01, inventory: 3 },
  { id: 2, title: 'H&M T-Shirt White', price: 10.99, inventory: 10 },
  { id: 3, title: 'Charli XCX - Sucker CD', price: 19.99, inventory: 2 },
  { id: 4, title: 'MacBook Pro - 13", black  ', price: 1109.99, inventory: 3 }
]

export default {
  getProducts (cb) {
    setTimeout(() => cb(_products), 1000)
  },

  buyProducts (products, cb, errorCb) {
    setTimeout(() => {
      // simulate random checkout failure.
      Math.random() > 0.5 || navigator.userAgent.indexOf('PhantomJS') > -1
        ? cb()
        : errorCb()
    }, 100)
  }
}
