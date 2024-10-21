<template>
  <div class="container">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in 3" :key="item" :class="'carousel-item-' + item">
      </el-carousel-item>
    </el-carousel>
  </div>

  <div class="container">

    <div class="text-center mb-2"><span style="font-weight: 600; font-size: 24px">Danh mục sản phẩm</span></div>
    <div class="row text-center">
      <Category v-for="category in categoryStore.listCategory" :title="category.category_name"
        :categoryId="category.category_id" :key="category.category_id" :image="apiUrl + category.image"
        AcctionDetail="Xem thêm" />
    </div>

  </div>

  <div class="container">
    <ProductTitleCard title="Khô cá Cà Mau" :product="productStore.fishList"
      @handleCreateProductLike="handleCreateProductLike" />
  </div>

  <div class="container">
    <ProductTitleCard title="Tôm Khô Cà Mau" :product="productStore.shrimpList"
      @handleCreateProductLike="handleCreateProductLike" />
  </div>

  <div class="container">
    <ProductTitleCard title="Bánh Phồng Tôm" :product="productStore.shrimpCrackList"
      @handleCreateProductLike="handleCreateProductLike" />
  </div>

</template>

<script setup>
import "../assets/card.css";
import "../assets/css/PulseLoader.css";
import Cookies from "js-cookie";
import Category from "./Categories/Category.vue";
import ProductTitleCard from "./Products/ProductTitleCard.vue";
import usePulseLoader from "../assets/js/PulseLoader.js";
import favoriteService from "@/services/favorite.service";
import productService from "@/services/product.service";
import { useSearchStore } from "@/stores/search";
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import cartService from "@/services/cart.service";
import { useCategoryStore } from "@/stores/category";
import { useFavoriteStore } from "@/stores/favorite";
import { useProductStore } from "@/stores/product";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";
import { formatCurrency } from '@/helpers/UtilHelper';
import { showSuccess, showWarning, showSuccessMessage } from "@/helpers/NotificationHelper";
const { loading, spinnerStyle, spinnerDelay1, spinnerDelay2, spinnerDelay3 } =
  usePulseLoader();
const apiUrl = import.meta.env.VITE_APP_API_URL;

const router = useRouter();
const productStore = useProductStore();
const favoriteStore = useFavoriteStore();
const categoryStore = useCategoryStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const searchStore = useSearchStore();




const handleCreateProductLike = async (productId) => {
  try {
    const response = await favoriteStore.createFavorite(productId);
    if (response.status === 'created') {
      showSuccessMessage("Đã thêm vào mục yêu thích");
    } else {
      showSuccessMessage("Đã xóa khỏi mục yêu thích");
    }
  } catch (error) {
    console.log(error.response);
  }
}

watch(
  () => searchStore.dataSearch,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      // alert("Thay đổi");
      fetchProductFromName(searchStore.dataSearch);
    }
  }
);

onMounted(async () => {
  await categoryStore.fetchListCategory();
  if (Cookies.get('isUserLoggedIn') == 'true') {
    await favoriteStore.fetchListFavorite();
  }
  await productStore.fetchListFish();
  await productStore.fetchListShrimp()
  await productStore.fetchListShrimpCrack();

  if (searchStore.dataSearch) {
    fetchProductFromName(searchStore.dataSearch);
  }
  if (authStore.isUserLoggedIn) {
    await cartStore.fetchCartCount();

  }

});

</script>

<style scoped>
.out-of-stock {
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: red;
  font-weight: bold;
}

.design-heart-red {
  background-color: red;
}

nav {
  background-color: #fff;
  color: #fff;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

nav li {
  margin: 0 10px;
}

nav a {
  color: #000;
  text-decoration: none;
}

nav a:hover {
  color: #ccc;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.carousel-item-1 {
  /* background-color: #000; */
  background-image: url("https://cdn.tgdd.vn/2023/03/CookDish/huong-dan-lam-mon-tom-lui-ca-mau-mon-ngon-doc-la-vung-dat-mui-avt-1200x676.jpg");
  background-repeat: no-repeat, repeat;
  background-size: cover;
  background-position: center center;
}

.carousel-item-2 {
  /* background-color: #000; */
  background-image: url("https://motogo.vn/wp-content/uploads/2020/02/mui-ca-mau.jpg");
  background-repeat: no-repeat, repeat;
  background-size: cover;
  background-position: center center;
}

.carousel-item-3 {
  /* background-color: #000; */
  background-image: url("https://mia.vn/media/uploads/blog-du-lich/danh-sach-dac-san-kho-ca-mau-hap-dan-khong-the-bo-qua-1663515466.jpg");
  background-repeat: no-repeat, repeat;
  background-size: cover;
  background-position: center center;
}

/* .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  } */

@media (max-width: 739px) {}

@media (min-width: 740px) and (max-width: 1023px) {}
</style>