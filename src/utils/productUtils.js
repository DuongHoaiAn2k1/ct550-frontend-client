import { useProductStore } from "@/stores/product";
import { useFavoriteStore } from "@/stores/favorite";

const productStore = useProductStore();
const favoriteStore = useFavoriteStore();


export const updateFishListWithLikes = () => {
    productStore.fishList.forEach((product) => {
      const isLiked = favoriteStore.listFavorite.some(
        (favorite) => favorite.product_id === product.product_id
      );
      product.liked = isLiked;
    });
};
  
export const updateShrimpListWithLikes = () => {
    productStore.shrimpList.forEach((product) => {
      const isLiked = favoriteStore.listFavorite.some(
        (favorite) => favorite.product_id === product.product_id
      );
      product.liked = isLiked;
    });
};