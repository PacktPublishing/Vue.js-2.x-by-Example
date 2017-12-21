const CategoryPage = {
  name: 'CategoryPage',

  template: `<div>
    <div v-if="category">
      <h1>{{ category.title }}</h1>
      <list-products :products="category.productDetails"></list-products>
    </div>
    <page-not-found v-if="categoryNotFound"></page-not-found>
  </div>`,

  components: {
    PageNotFound
  },

  props: {
    slug: String
  },
  
  data() {
    return {
      categoryNotFound: false
    }
  },

  computed: {
    ...Vuex.mapGetters([
      'categoriesExist',
      'categoryProducts'
    ]),

    category() {
      if(this.categoriesExist) {
        let category = this.categoryProducts(this.slug),
          filters = Object.assign({}, this.$route.query);

        if(Object.keys(filters).length && filters.hasProperty('page')) {
          delete filters.page;
        }    

        if(Object.keys(filters).length) {
          category.productDetails = category.productDetails.filter(
            p => this.filtering(p, filters)
          );
        }

        if(!category) {
          this.categoryNotFound = true;
        }
        return category;
      }
    }
  },

  methods: {
    filtering(product, query) {
      let display = false,
        hasProperty = {};

        Object.keys(query).forEach(key => {
          let filter = Array.isArray(query[key]) ? query[key] : [query[key]];

          for(attribute of filter) {
            if(key == 'vendor') {

              hasProperty.vendor = false;
              if(product.vendor.handle == attribute) {
                hasProperty.vendor = true;
              }

            } else  if(key == 'tags') {
              hasProperty.tags = false;

              product[key].map(key => {
                if(key.handle == attribute) {
                  hasProperty.tags = true;
                }
              });

            } else {
              hasProperty[key] = false;

              let variant = product.variationProducts.map(v => {
                if(v.variant[key] && v.variant[key].handle == attribute) {
                  hasProperty[key] = true;
                }
              });
            }
          }

          if(Object.keys(hasProperty).every(key => hasProperty[key])) {
            display = true;
          }

        });

      return display;
    }
  }
};