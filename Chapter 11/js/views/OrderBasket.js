const OrderBasket = {
  name: 'OrderBasket',

  template: `<div>
    <h1>Basket</h1>
    <list-purchases :editable="true" />
    <router-link :to="{name: 'Checkout'}">Proceed to Checkout</router-link>
  </div>`,

  components: {
    ListPurchases
  }
};