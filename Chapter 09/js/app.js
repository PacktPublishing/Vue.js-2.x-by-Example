Vue.use(ShopifyProducts);

const store = new Vuex.Store({
	state: {
		products: {},
		categories: {},

		categoryHome: {
			title: 'Welcome to the Shop',
			handle: 'home',
			products: [
				'adjustable-stem',
				'fizik-saddle-pak',
				'kenda-tube',
				'colorful-fixie-lima',
				'oury-grip-set',
				'pure-fix-pedals-with-cages'
			]
		}
	},

	mutations: {
		products(state, payload) {
			let products = {};

			Object.keys(payload).forEach(key => {
				let product = payload[key];

				let prices = [];
				for(let variation of product.variationProducts) {
					if(!prices.includes(variation.price)) {
						prices.push(variation.price);
					}
				}

				product.price = Math.min(...prices);
				product.hasManyPrices = prices.length > 1;

				products[key] = product;
			});

			state.products = products;
		}
	}
});


const router = new VueRouter({
	routes: [
		{
			path: '/product/:slug',
			name: 'Product',
			component: ProductPage
		},

		{
			path: '/404',
			alias: '*',
			component: PageNotFound
		}
	]
});

new Vue({
	el: '#app',

	store,
	router,

	created() {
		CSV.fetch({url: './data/csv-files/bicycles.csv'}).then(data => {
			this.$store.commit('products', this.$formatProducts(data));
		});
	}
});