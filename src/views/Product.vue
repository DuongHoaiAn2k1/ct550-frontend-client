<template>
  <div class="container">
    <div class="row text-center">
      <Category v-for="category in categoryStore.listCategory" :title="category.category_name"
        :categoryId="category.category_id" :key="category.category_id"
        :image="'../../assets/images/category/' + category.category_name + '.jpg'" AcctionDetail="Xem thêm" />
    </div>
  </div>

  <div class="container bg-trasparent mt-2" style="position: relative">
    <p class="text-center" style="margin-bottom: 0px; font-weight: 600; font-size: 24px">
      {{ categoryName }}
    </p>
    <div v-show="!loading" class="row row-cols-1 row-cols-xs-2 row-cols-sm-2 row-cols-lg-5 g-3">
      <div class="col hp" v-for="product in listProduct[categoryID]" :key="product.product_id">
        <div class="card h-100 shadow-sm">
          <ProductCard :productId="product.product_id" :productName="product.product_name"
            :price="product.product_price"
            :image="'https://dacsancamau.com/storage/' + JSON.parse(product.product_img)[0]" :liked.sync="product.liked"
            @handleCreateProductLike="handleCreateProductLike" />
          <p v-show="product.product_quantity == 0" class="out-of-stock">
            Hết Hàng
          </p>

        </div>
      </div>
    </div>
    <div class="text-center my-5">
      <LoadingSpinner :loading="loading" :spinnerStyle="spinnerStyle" :spinnerDelay1="spinnerDelay1"
        :spinnerDelay2="spinnerDelay2" :spinnerDelay3="spinnerDelay3" />
    </div>
  </div>
</template>

<script setup>
import "../assets/card.css";
import LoadingSpinner from "@/components/Products/LoadingSpinner.vue";
import ProductCard from "@/components/Products/ProductCard.vue";
import Category from "../components/Categories/Category.vue";
import { computed, onMounted, watch, ref, watchEffect } from "vue";
import favoriteService from "@/services/favorite.service";
import productService from "@/services/product.service";
import { useAuthStore } from "@/stores/auth";
import cartService from "@/services/cart.service";
import { useRoute } from "vue-router";
import categoryService from "@/services/category.service";
import { useSearchStore } from "@/stores/search";
import { useCartStore } from "@/stores/cart";
import { useCategoryStore } from "../stores/category";
import { useProductStore } from "../stores/product";
import { useFavoriteStore } from "../stores/favorite";
import { showWarning, showSuccess, showSuccessMessage } from "../helpers/NotificationHelper";


var categoryName = "";


const categoryStore = useCategoryStore();
const productStore = useProductStore();
const favoriteStore = useFavoriteStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const route = useRoute();
const searchStore = useSearchStore();
const categoryID = computed(() => route.params.id);
const listProduct = ref([]);
const listFavorite = ref([]);
const fetchListFavorite = async () => {
  try {
    const response = await favoriteService.getByUser();
    listFavorite.value = response.data;
    console.log("List favorite: ", response);
  } catch (error) {
    console.log(error.response);
  }
};

const fetchListProduct = async () => {
  try {
    const response = await productService.getGroupByCategory();
    listProduct.value = response.groupedProducts;
  } catch (error) {
    console.log(error.response);
  }
};



const updateListProductWithLikes = () => {
  listProduct.value[categoryID.value].forEach((product) => {
    const isLiked = favoriteStore.listFavorite.some(
      (favorite) => favorite.product_id == product.product_id
    );
    product.liked = isLiked;
  });
};
onMounted(async () => {
  await categoryStore.fetchListCategory().finally(() => {
    categoryName = categoryStore.getCategoryNameById(categoryID.value);
  });
  console.log("Category name: ", categoryName);
  fetchListProduct();
  fetchListFavorite();
  cartStore.fetchCartCount();
  searchStore.setDataSearch("");
  await favoriteStore.fetchListFavorite().finally(() => {
    updateListProductWithLikes();
    console.log("List product: ", listProduct.value);
  });

});

const handleCreateProductLike = async (productId, liked) => {
  try {
    if (!liked) {
      await favoriteStore.createFavorite(productId);
      showSuccessMessage("Đã thêm vào mục yêu thích");
      await favoriteStore.fetchListFavorite().finally(() => {
        updateListProductWithLikes();
      })
    } else {
      await favoriteStore.deleteFavorite(productId);
      showSuccessMessage("Đã xóa khỏi mục yêu thích");
      await favoriteStore.fetchListFavorite().finally(() => {
        updateListProductWithLikes();
      })
    }

  } catch (error) {
    console.log(error.response);
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
watchEffect(async () => {
  await fetchListFavorite();
});

watch(categoryID, async () => {
  categoryName = categoryStore.getCategoryNameById(categoryID.value);
  updateListProductWithLikes();
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