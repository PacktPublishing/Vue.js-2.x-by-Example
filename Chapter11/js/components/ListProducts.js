Vue.component('list-products', {
  template: `<div v-if="products">
    <p v-if="pagination.totalPages > 1">
      Page {{ currentPage }} out of {{ pagination.totalPages }}
    </p>

    <div v-if="pagination.totalProducts > 12">
      Products per page: 
      <select v-model="perPage">
        <option>12</option>
        <option>24</option>
        <option v-if="pagination.totalProducts > 24">48</option>
        <option v-if="pagination.totalProducts > 48">60</option>
      </select>
    </div>

    <button 
      @click="toPage(currentPage - 1)" 
      :disabled="currentPage == 1" 
      v-if="pagination.totalPages > 1"
    >
      Previous page
    </button>
    <button 
      @click="toPage(currentPage + 1)" 
      :disabled="currentPage == pagination.totalPages" 
      v-if="pagination.totalPages > 1"
    >
      Next page
    </button>

    <div class="ordering">
      <select v-model="ordering">
        <option value="">Order products</option>
        <option value="title-asc">Title - ascending (A - Z)</option>
        <option value="title-desc">Title - descending (Z - A)</option>
        <option value="price-asc">Price - ascending ($1 - $999)</option>
        <option value="price-desc">Price - descending ($999 - $1)</option>
      </select>
    </div>

    <ol :start="pagination.range.from + 1">
      <li v-for="product in paginate()" :key="product.handle">
        <router-link :to="{name: 'Product', params: {slug: product.handle}}">
          <img v-if="product.images[0]" :src="product.images[0].source" :alt="product.title" width="120">
        </router-link>
        <h3>
          <router-link :to="{name: 'Product', params: {slug: product.handle}}">
            {{ product.title }}
          </router-link>
        </h3>
        <p>Made by: {{ product.vendor.title }}</p>
        <p>Price {{ productPrice(product) }}</p>
      </li>
    </ol>

    <nav v-if="pagination.totalPages > pageLinksCount">
      <ul>
        <li v-for="page in pageLinks">
          <button @click="toPage(page)">{{ page }}</button>
        </li>
      </ul>
    </nav>
  </div>`,

  props: {
    products: Array
  },

  data() {
    return {
      perPage: 12, 
      currentPage: 1,
      pageLinksCount: 3,

      ordering: ''
    }
  },

  computed: {
    pagination() {
      if(this.products) {
        let totalProducts = this.products.length,
          pageFrom = (this.currentPage * this.perPage) - this.perPage,
          totalPages = Math.ceil(totalProducts / this.perPage);

        return {
          totalProducts: totalProducts,
          totalPages: Math.ceil(totalProducts / this.perPage),
          range: {
            from: pageFrom,
            to: pageFrom + this.perPage
          }
        }
      }
    },

    pageLinks() {
      if(this.products.length) {
        let negativePoint = this.currentPage - this.pageLinksCount,
          positivePoint = this.currentPage + this.pageLinksCount,
          pages = [];


        if(negativePoint < 1) {
          negativePoint = 1;
        }

        if(positivePoint > this.pagination.totalPages) {
          positivePoint = this.pagination.totalPages;
        }

        for (var i = negativePoint; i <= positivePoint; i++) {
          pages.push(i)
        }

        return pages;
      }
    },

    orderProducts() {
      let output;

      if(this.ordering.length) {
        let orders = this.ordering.split('-');
        output = this.products.sort(function(a, b) {
          if(typeof a[orders[0]] == 'string') {
            return a[orders[0]].localeCompare(b[orders[0]]);
          } else {
            return a[orders[0]] - b[orders[0]];
          }
        });

        if(orders[1] == 'desc') {
          output.reverse();
        }
      } else {
        output = this.products;
      }
      return output;
    }
  },

  watch: {
    '$route'(to) {
      this.currentPage = parseInt(to.query.page) || 1;
    },

    perPage() {
      if(this.currentPage > this.pagination.totalPages) {
        this.$router.push({
          query: Object.assign({}, this.$route.query, {
            page: this.pagination.totalPages
          })
        })
      }
    }
  },

  created() {
    if(this.$route.query.page) {
      this.currentPage = parseInt(this.$route.query.page);
    }
  },

  methods: {
    toPage(page) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          page
        })
      });
      this.currentPage = page;
    },

    paginate() {
      return this.orderProducts.slice(
        this.pagination.range.from, 
        this.pagination.range.to
      );
    },

    productPrice(product) {
      let price = '$' + product.price;

      if(product.hasManyPrices) {
        price = 'From: ' + price;
      }

      return price;
    }
  }
});