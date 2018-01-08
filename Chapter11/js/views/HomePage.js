const HomePage = {
  name: 'HomePage',

  template: `<div>
    <list-products :products="products"></list-products>
  </div>`,

  data() {
    return {
      selectedProducts: [
        'adjustable-stem',
        'fizik-saddle-pak',
        'kenda-tube',
        'colorful-fixie-lima',
        'oury-grip-set',
        'pure-fix-pedals-with-cages'
      ]
    }
  },

  computed: {
    products() {
      let products = this.$store.state.products,
        output = [];

      if(Object.keys(products).length) {
        for(let featured of this.selectedProducts) {
          output.push(products[featured]);
        }
        return output;
      }
    }
  }
};