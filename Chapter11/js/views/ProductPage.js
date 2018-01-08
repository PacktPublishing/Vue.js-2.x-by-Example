const ProductPage = {
  name: 'ProductPage',

  template: `<div>
    <div v-if="product">
      <div class="images" v-if="image">
        <div class="main">
          <img 
            :src="image.source" 
            :alt="image.alt || product.title">
        </div>

        <div class="thumbnails" v-if="product.images.length > 1">
          <template v-for="img in product.images">
            <img 
              :src="img.source" 
              :alt="img.alt || product.title" 
              width="100" 
              @click="updateImage(img)">
          </template>
        </div>
      </div> 

      <h1>{{ product.title }} - \${{ variation.price }}</h1>

      <div class="meta">
        <span v-if="product.vendor">
          Manufacturer: <strong>{{ product.vendor.title }}</strong>
        </span>
        <span v-if="product.type">
          Category: <strong>{{ product.type.title }}</strong>
        </span>
        <span>
          Quantity: <strong>{{ variation.quantity }}</strong>
        </span>
      </div>

      <div class="variations">
        <select v-model="variation" v-if="product.variationProducts.length > 1">
          <option 
            v-for="variation in product.variationProducts" 
            :key="variation.barcode" 
            :value="variation"
            v-html="variantTitle(variation) + ((!variation.quantity) ? ' - out of stock' : '')"
          ></option>
        </select>

        <button 
          @click="addToBasket()" 
          :class="(addedToBasket) ? 'isAdded' : ''" 
          :disabled="!variation.quantity"
        >
          {{ 
            (variation.quantity) ? 
            ((addedToBasket) ? 'Added to your basket' : 'Add to basket') : 
            'Out of stock'
          }}
        </button>
      </div>

      <div v-html="product.body"></div>

    </div>
    <page-not-found v-if="productNotFound"></page-not-found>
  </div>`,

  components: {
    PageNotFound
  },
  
  data() {
    return {
      slug: this.$route.params.slug,
      productNotFound: false,
      image: false,
      variation: false,
      addedToBasket: false
    }
  },

  computed: {
    product() {
      let product;

      if(Object.keys(this.$store.state.products).length) {

        product = this.$store.state.products[this.slug];

        this.image = (product.images.length) ? product.images[0] : false;
        this.variation = product.variationProducts[0];

        if(!product) {
          this.productNotFound = true;
        }
      }

      return product;
    }
  },

  watch: {
    variation(v) {
      if(v.hasOwnProperty('image')) {
        this.updateImage(v.image);
      }
      
      this.addedToBasket = false;
    },

    '$route'(to) {
      this.slug = to.params.slug;
      this.addedToBasket = false;
    }
  },

  methods: {
    updateImage(img) {
      this.image = img;
    },

    variantTitle(variation) {
      let variants = variation.variant,
        output = [];

      for(let a in variants) {
        output.push(`${variants[a].name}: ${variants[a].value}`);
      }

      return output.join(' / ');
    },

    addToBasket() {
      this.$store.commit('addToBasket', this);

      this.addedToBasket = true;
      setTimeout(() => this.addedToBasket = false, 2000);
    }
  }
};