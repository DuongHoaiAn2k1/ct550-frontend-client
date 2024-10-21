<template>
  <div class="container mt-1">
    <div class="row text-center">
      <Category v-for="category in categoryStore.listCategory" :title="category.category_name"
        :categoryId="category.category_id" :key="category.category_id" :image="apiUrl + category.image"
        AcctionDetail="Xem thêm" />
    </div>
  </div>

  <div class="container mt-2">
    <p class="text-center" style="margin-bottom: 0px; font-weight: 600; font-size: 24px">
      {{ categoryName }}
    </p>
    <div v-show="!loading" class="product-title-card">
      <div class="row">
        <ProductCard v-for="product in listProduct" :key="product.product_id" :price="product.product_price"
          :productName="product.product_name" :productId="product.product_id" :product="product"
          :image="apiUrl + JSON.parse(product.product_img)[0]" :liked.sync="product.liked"
          @handleCreateProductLike="handleCreateProductLike" />
      </div>
      <!-- <p v-show="product.product_quantity == 0" class="out-of-stock">
            Hết Hàng
          </p> -->
    </div>
    <div class="text-center my-5">
      <LoadingSpinner :loading="loading" :spinnerStyle="spinnerStyle" :spinnerDelay1="spinnerDelay1"
        :spinnerDelay2="spinnerDelay2" :spinnerDelay3="spinnerDelay3" />
    </div>
  </div>
</template>

<script setup>
import ProductCard from "../components/Products/ProductCard.vue";
import "../assets/css/PulseLoader.css";
import { computed, onMounted, ref, watch } from "vue";
import usePulseLoader from "../assets/js/PulseLoader.js";
import Category from "../components/Categories/Category.vue";
import LoadingSpinner from "@/components/Products/LoadingSpinner.vue";
import { useCategoryStore } from "@/stores/category";
import { useRoute } from "vue-router";
import productService from "../services/product.service";
import { useFavoriteStore } from "@/stores/favorite";
import { showSuccess, showWarning, showSuccessMessage } from "@/helpers/NotificationHelper";
const { loading, spinnerStyle, spinnerDelay1, spinnerDelay2, spinnerDelay3 } = usePulseLoader();

const route = useRoute();
const categoryID = computed(() => route.params.id);
const categoryStore = useCategoryStore();
const apiUrl = import.meta.env.VITE_APP_API_URL;
const categoryName = ref("");
const listProduct = ref([]);
const favoriteStore = useFavoriteStore();

const fetchListProductByCategoryId = async (categoryId) => {
  try {
    const response = await productService.getProductByCategoryId(categoryId);
    listProduct.value = response.data;
    console.log("Product detail: ", response);
  } catch (error) {
    console.log(error.response)
  }
}

// const addToCart = async (product_id) => {
//   if (authStore.isUserLoggedIn) {
//     try {
//       const user_id = authStore.user_id;
//       const response = await cartService.create({
//         user_id: user_id,
//         product_id: product_id,
//         quantity: 1,
//       });
//       await cartStore.fetchCartCount();
//       console.log("Ket qua them: ", response);
//       showSuccess("Thêm vào giỏ hàng thành công")
//     } catch (error) {
//       console.log(error.response);
//       if (error.response.data.message === "Qúa số lượng cho phép") {
//         showWarning("Đã quá số lướng cho phép");
//       }
//     }
//   } else {
//     warning();
//     setTimeout(() => {
//       router.push({ name: "login" });
//     }, 500);
//   }
// };


const handleCreateProductLike = async (productId) => {
  try {
    const response = await favoriteStore.createFavorite(productId);
    if (response.status === 'created') {
      showSuccessMessage("Đã thêm vào mục yêu thích");
      fetchListProductByCategoryId(categoryID.value);
    } else {
      showSuccessMessage("Đã xóa khỏi mục yêu thích");
      fetchListProductByCategoryId(categoryID.value);
    }

  } catch (error) {
    console.log(error.response);
  }
}
watch(() => categoryID.value, (newValue) => {
  if (newValue) {
    loading.value = true;
    fetchListProductByCategoryId(categoryID.value);
    categoryName.value = categoryStore.getCategoryNameById(categoryID.value);
    setTimeout(() => {

      loading.value = false;
    }, 500);
  }
});

onMounted(async () => {
  await categoryStore.fetchListCategory().then(() => {
    categoryName.value = categoryStore.getCategoryNameById(categoryID.value);
  })
  await favoriteStore.fetchListFavorite();
  fetchListProductByCategoryId(categoryID.value);
  setTimeout(() => {
    loading.value = false;
  }, 500);
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

.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>