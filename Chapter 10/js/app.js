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
		},

		categories(state, payload) {
			let categories = {},
				other = {
					title: 'Other',
					handle: 'other'
				};

			Object.keys(payload).forEach(key => {
				let product = payload[key],
					type = product.hasOwnProperty('type') ? product.type : other;

				if(!categories.hasOwnProperty(type.handle)) {
					categories[type.handle] = {
						title: type.title,
						handle: type.handle,
						products: []
					}
				}

				categories[type.handle].products.push(product.handle);
			});

			Object.keys(categories).forEach(key => {
				let category = categories[key];

				if(category.products.length < 3) {
					categories.other.products = categories.other.products.concat(category.products);
					delete categories[key];
				}
			});

			let categoriesSorted = {}
			Object.keys(categories).sort().forEach(key => {
				categoriesSorted[key] = categories[key]
			});
			state.categories = categories;
		}
	},

	actions: {
		initialiseShop({commit}, products) {
			commit('products', products);
			commit('categories', products);
		}
	},

	getters: {
		categoriesExist: (state) => {
			return Object.keys(state.categories).length;
		},

		categoryProducts: (state, getters) => (slug) => {
			if(getters.categoriesExist) {
				let category = false,
				products = [];

				if(slug) {
					category = state.categories[slug];
				} else {
					category = state.categoryHome;
				}

				if(category) {
					for(let featured of category.products) {
						products.push(state.products[featured]);
					}

					category.productDetails = products;
				}
				return category;
			}
		}
	}
});


const router = new VueRouter({
	routes: [
		{
			path: '/',
			name: 'Home',
			components: {
				default: CategoryPage,
				sidebar: ListCategories
			},
			props: {
				default: true,
				sidebar: true
			}
		},
		{
			path: '/category/:slug',
			name: 'Category',
			components: {
				default: CategoryPage,
				sidebar: ProductFiltering
			},
			props: {
				default: true,
				sidebar: true
			}
		},
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
			this.$store.dispatch('initialiseShop', this.$formatProducts(data));
		});
	}
});