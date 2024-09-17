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
        :categoryId="category.category_id" :key="category.category_id"
        :image="'https://dacsancamau.com/storage/' + category.image" AcctionDetail="Xem thêm" />
    </div>

  </div>

  <div class="container">
    <ProductTitleCard title="Khô cá Cà Mau" :product="productStore.fishList"
      @handleCreateProductLike="handleCreateProductLike" />
  </div>

  <div v-show="listProductByName.length != 0" class="container bg-trasparent mt-2" style="position: relative">
    <p style="margin-bottom: 0px; font-weight: 600">KẾT QUẢ TÌM KIẾM</p>
    <div v-show="!loading" class="row row-cols-1 row-cols-xs-2 row-cols-sm-2 row-cols-lg-5 g-3">
      <div class="col hp" v-for="product in listProductByName" :key="product.product_id">
        <div class="card h-100 shadow-sm">
          <router-link :to="{ name: 'product-detail', params: { id: product.product_id } }">
            <img :src="'http://127.0.0.1:8000/storage/' +
              JSON.parse(product.product_img)[0]
              " class="card-img-top" alt="product.title" />
          </router-link>
          <p v-show="product.product_quantity == 0" class="out-of-stock">
            Hết Hàng
          </p>
          <!-- <div class="label-top shadow-sm">
              <a class="text-white" href="#">asus</a>
            </div> -->
          <div class="card-body">
            <h5 style="margin-bottom: 0px" class="card-title">
              <p class="name-product">{{ product.product_name }}</p>
              <p style="margin-bottom: 0px !important; font-weight: 600" class="mt-2 text-danger text-end">
                {{ formatCurrency(product.product_price) }}/kg
              </p>
            </h5>

            <div class="d-grid gap-2">
              <a v-show="product.product_quantity != 0" @click="addToCart(product.product_id, product.weight)"
                class="btn btn-warning bold-btn">Thêm</a>
              <a v-show="product.product_quantity == 0" class="btn btn-warning bold-btn">Thêm</a>
            </div>
            <div class="clearfix mt-1">
              <span class="float-end" v-show="!product.liked" @click="createFavorite(product.product_id)">
                <i class="fa-regular fa-heart" style="cursor: pointer; font-size: 24px"></i>
              </span>
              <span class="float-end" v-show="product.liked" @click="deleteFavorite(product.product_id)">
                <i class="fa-solid fa-heart" style="cursor: pointer; font-size: 24px"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center my-5">
      <div class="v-spinner" v-show="loading">
        <div class="v-pulse v-pulse1" :style="[spinnerStyle, spinnerDelay1]"></div>
        <div class="v-pulse v-pulse2" :style="[spinnerStyle, spinnerDelay2]"></div>
        <div class="v-pulse v-pulse3" :style="[spinnerStyle, spinnerDelay3]"></div>
      </div>
    </div>
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
const router = useRouter();
const productStore = useProductStore();
const favoriteStore = useFavoriteStore();
const categoryStore = useCategoryStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const searchStore = useSearchStore();

const listProductByName = ref([]);

const fetchProductFromName = async (data) => {
  try {
    const response = await productService.getProductByName({
      product_name: data,
    });
    listProductByName.value = response.data;
    console.log("Product By Name: ", listProductByName);
  } catch (error) {
    console.log(error.response);
  }
};
const deleteFavorite = async (productId) => {
  try {
    const response = await favoriteService.delete(productId);
    showSuccess("Đã loại bỏ khỏi danh sách yêu thích");
    setTimeout(() => {
      updateFishListWithLikes();
      updateShrimpListWithLikes();
    }, 1000);
  } catch (error) {
    console.log(error.response);
  }
};

const createFavorite = async (productId) => {
  try {
    const response = await favoriteService.create({ product_id: productId });
    showSuccess("Thêm vào danh sách yêu thích thành công");
    setTimeout(() => {
      updateFishListWithLikes();
      updateShrimpListWithLikes();
    }, 1000);
  } catch (error) {
    console.log(error.response);
  }
};
const updateFishListWithLikes = () => {
  productStore.fishList.forEach((product) => {
    const isLiked = favoriteStore.listFavorite.some(
      (favorite) => favorite.product_id == product.product_id
    );
    product.liked = isLiked;
  });
};

const updateShrimpListWithLikes = () => {
  productStore.shrimpList.forEach((product) => {
    const isLiked = favoriteStore.listFavorite.some(
      (favorite) => favorite.product_id == product.product_id
    );
    product.liked = isLiked;
  });
};

const handleCreateProductLike = async (productId, liked) => {
  try {
    if (!liked) {
      await favoriteStore.createFavorite(productId);
      showSuccessMessage("Đã thêm vào mục yêu thích");
      await favoriteStore.fetchListFavorite().finally(() => {
        updateFishListWithLikes();
        updateShrimpListWithLikes();
      })
    } else {
      await favoriteStore.deleteFavorite(productId);
      showSuccessMessage("Đã xóa khỏi mục yêu thích");
      await favoriteStore.fetchListFavorite().finally(() => {
        updateFishListWithLikes();
        updateShrimpListWithLikes();
      })
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

  if (searchStore.dataSearch) {
    fetchProductFromName(searchStore.dataSearch);
  }
  if (authStore.isUserLoggedIn) {
    await cartStore.fetchCartCount();

  }
  setTimeout(() => {
    updateFishListWithLikes();
    updateShrimpListWithLikes();
    loading.value = false;
    // console.log("List fish after update likes: ", productStore.fishList);
  }, 3000);

});
const addToCart = async (product_id, weight) => {
  if (authStore.isUserLoggedIn) {
    try {
      const user_id = authStore.user_id;
      const response = await cartService.create({
        user_id: user_id,
        product_id: product_id,
        quantity: 1,
        total_weight: weight,
      });
      await cartStore.fetchCartCount();
      console.log("Ket qua them: ", response);
      shhowSuccess("Them vào giỏ hàng thành công");
    } catch (error) {
      console.log(error.response);
      if (error.response.data.message === "Qúa số lượng cho phép") {
        showWarning("Đã quá số lượng cho phép");
      }
    }
  } else {
    showWarning("Vui lòng đăng nhập để tiến hành mua sản phẩm");
    setTimeout(() => {
      router.push({ name: "login" });
    }, 500);
  }
};

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