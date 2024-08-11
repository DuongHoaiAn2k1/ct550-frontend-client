import productService from "@/services/product.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useProductStore = defineStore("product", {
  state: () => ({
    listProduct: [],
    fishList: [],
    shrimpList: [],
  }),
  actions: {
    //Lay danh sach tat ca san  pham
    async fetchListProduct() {
      try {
        const response = await productService.getAll();
        this.listProduct = response.listProduct;
        console.log("List product ref store: ", response);
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchListFish() {
      try {
        const response = await productService.getProductFromCategoryName({
          category_name: "Khô cá Cà Mau",
        });
        this.fishList = response.data.slice(0, 5);
        console.log("Cá: ", this.fishList);
      } catch (error) {
        console.log(error.response);
      }
    },

    async fetchListShrimp() {
      try {
        const response = await productService.getProductFromCategoryNameP({
          category_name: "Tôm khô Cà Mau",
        });
        this.shrimpList = response.data.slice(0, 5);
        console.log("Tôm: ", response);
      } catch (error) {
        console.log(error.response);
      }
    },

    getProductById(product_id) {
      return this.listProduct.find(product => product.product_id == product_id);
    },

    getProductPrice(product_id) {
      return this.listProduct.find(product => product.product_id == product_id)?.product_price;
    },

    getProductImage(product_id) {
      return this.listProduct.find(product => product.product_id == product_id)?.product_img;
    },

    getProductName(product_id) {
      return this.listProduct.find(product => product.product_id == product_id)?.product_name;
    }
  },
});
