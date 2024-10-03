<template>
  <!-- <AppHeader :number="number" /> -->
  <AppHeader />
  <div class="content-container">
    <router-view />
  </div>
  <AppFooter />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import AppHeader from "./components/layouts/AppHeader.vue";
import AppFooter from "./components/layouts/AppFooter.vue";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { useFavoriteStore } from "@/stores/favorite";
import { useProductStore } from "@/stores/product";
import { useCategoryStore } from "@/stores/category";

const number = ref(0);

const cartStore = useCartStore();
const authStore = useAuthStore();
const favoriteStore = useFavoriteStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();


const updateFishListWithLikes = () => {
  productStore.fishList.forEach((product) => {
    const isLiked = favoriteStore.listFavorite.some(
      (favorite) => favorite.product_id === product.product_id
    );
    product.liked = isLiked;
  });
};

const updateShrimpListWithLikes = () => {
  productStore.shrimpList.forEach((product) => {
    const isLiked = favoriteStore.listFavorite.some(
      (favorite) => favorite.product_id === product.product_id
    );
    product.liked = isLiked;
  });
};
onMounted(async () => {
  if (categoryStore.listCategory.lenght == 0) {
    await categoryStore.fetchListCategory();
  }

  if (authStore.isUserLoggedIn == true) {
    await cartStore.fetchCartCount();
    number.value = cartStore.count;
    await productStore.fetchListFish();
    await productStore.fetchListShrimp();
    await favoriteStore.fetchListFavorite().finally(() => {
      updateFishListWithLikes();
      updateShrimpListWithLikes();
    });
  } else {
    number.value = 0;
  }
});

</script>
<style>
body {
  margin: 0;
  font-family: "Quicksand", sans-serif !important;
  background-image: url('assets/body.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  /* Làm cho nền cố định khi cuộn */
}

/* .content-container {
  padding: 20px;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
} */

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
