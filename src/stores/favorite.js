import { defineStore } from "pinia";
import favoriteService from "../services/favorite.service";
export const useFavoriteStore = defineStore("favorite", {
  state: () => ({
    listFavorite: [],
    length: 0
  }),

  actions: {
    async fetchListFavorite() {
      try{
        const response = await favoriteService.getByUser();
        this.listFavorite = response.data;
        this.length = response.length;
        console.log('Fetch list favorite from store: ',this.listFavorite);
      }catch(error){
        console.log(error);
      }
    },

    async createFavorite(product_id) {
      try {
        const response = await favoriteService.create({product_id: product_id});
        console.log("Create favorite: ", response);
        this.fetchListFavorite();
        return response;
      } catch (error) {
        console.log(error.response);
      }
    },
  },

});
