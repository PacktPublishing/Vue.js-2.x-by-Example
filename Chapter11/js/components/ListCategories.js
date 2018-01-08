const ListCategories = {
  name: 'ListCategories',

  template: `<div v-if="categories">
    <ul>
      <li v-for="category in categories">
        <router-link :to="{name: 'Category', params: {slug: category.handle}}">
          {{ category.title }} ({{ category.products.length }})
        </router-link>
      </li>
    </ul>
  </div>`,

  computed: {
    categories() {
      return this.$store.state.categories;
    }
  }  
};