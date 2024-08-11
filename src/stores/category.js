import { defineStore } from 'pinia';
import categoryService from '@/services/category.service';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    listCategory: [],
    length: 0
  }),
 
  getters: {
    getListCategory: (state) => state.listCategory,
    getCategoryNameById: (state) => (category_id) => {
      const category = state.listCategory.find(cat => cat.category_id == category_id);
      return category ? category.category_name : null;
    },
  },

  actions: {
    async fetchListCategory() {
      try {
        const response = await categoryService.getAll();
        this.listCategory = response.listCategory;
        this.length = response.length
        console.log("List category ref store: ", this.listCategory);
        console.log("Fetch List category from store: ", response);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
  },
});