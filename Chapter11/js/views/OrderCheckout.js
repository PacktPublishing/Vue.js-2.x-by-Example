const OrderCheckout = {
  name: 'OrderCheckout',

  template: `<div>
    <h1>Order Confirmation</h1>
    <p>Please check the items below and fill in your details to complete your order</p>
    <list-purchases />

    <form @submit="submitForm()">
      <fieldset>
        <h2>Billing Details</h2>
        <label for="billingName">Name:</label>
        <input type="text" id="billingName" v-model="billing.name">
        <label for="billingAddress">Address:</label>
        <input type="text" id="billingAddress" v-model="billing.address">
        <label for="billingZipcode">Post code/Zip code:</label>
        <input type="text" id="billingZipcode" v-model="billing.zipcode">
      </fieldset>

      <label for="sameAddress">
        <input type="checkbox" id="sameAddress" v-model ="sameAddress">
        Delivery address is the same as billing
      </label>

      <fieldset>
        <h2>Delivery Details</h2>
        <label for="deliveryName">Name:</label>
        <input type="text" id="deliveryName" v-model="delivery.name" :disabled="sameAddress">
        <label for="deliveryAddress">Address:</label>
        <input type="text" id="deliveryAddress" v-model="delivery.address" :disabled="sameAddress">
        <label for="deliveryZipcode">Post code/Zip code:</label>
        <input type="text" id="deliveryZipcode" v-model="delivery.zipcode" :disabled="sameAddress">
      </fieldset>

      <input type="submit" value="Purchase items">
    </form>
  </div>`,

  components: {
    ListPurchases
  },

  data() {
    return {
      sameAddress: false,

      billing: {
        name: '',
        address: '',
        zipcode: ''
      },
      delivery: {
        name: '',
        address: '',
        zipcode: ''
      }
    }
  },

  watch: {
    sameAddress() {
      if(this.sameAddress) {
        this.delivery = this.billing;
      } else {
        this.delivery = Object.assign({}, this.billing);
      }
    }
  },

  methods: {
    submitForm() {
      // this.billing = billing details
      // this.delivery = delivery details
      
      this.$router.push({name: 'Confirmation'});
    }
  }
};