import { defineStore } from "pinia";
import favoriteService from "../services/favorite.service";
export const useFavoriteStore = defineStore("favorite", {
  state: () => ({
    listFavorite: [],
  }),

  actions: {
    async fetchListFavorite() {
      try{
        const response = await favoriteService.getByUser();
        this.listFavorite = response.data;
        console.log('Fetch list favorite from store: ',response);
      }catch(error){
        console.log(error.response);
      }
    }
  },
});
