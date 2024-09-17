<template>
  <div class="container">
    <div class="single_product">
      <div class="container-fluid" style="background-color: #fff; padding: 11px">
        <ProductDetail :product="product" :productDetail="productDetail" :averageRating="averageRating" :img_1="img_1"
          :img_2="img_2" :img_3="img_3" :quantity="quantity" :loading="loading" @increment-quantity="incrementQuantity"
          @decrement-quantity="decrementQuantity" @add-to-cart="handleAddToCart" @buy-now="handleBuyNow"
          @create-favorite="createFavorite" @delete-favorite="deleteFavorite" />

        <LoadingSpinner :loading="loading" :spinnerStyle="spinnerStyle" :spinnerDelay1="spinnerDelay1"
          :spinnerDelay2="spinnerDelay2" :spinnerDelay3="spinnerDelay3" />
        <div class="row row-underline">
          <div class="col-md-6">
            <span class="deal-text">Các sản phẩm có liên quan</span>
          </div>
          <div class="col-md-6"></div>
        </div>
        <ProductList :listProductByCategory="listProductByCategory" :formatCurrency="formatCurrency" />
        <ProductReview :isReviewProduct="isReviewProduct" :isBuyingProduct="isBuyingProduct" :rateComment="rateComment"
          :commentValue="commentValue" :dataReviewByProductLength="dataReviewByProductLength"
          :listCommentPagination="listCommentPagination" :currentPage="currentPage" :pageSize="pageSize"
          @handleComment="handleComment" @handleCurrentChange="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import "../assets/css/PulseLoader.css";
import Cookies from "js-cookie";
import usePulseLoader from "../assets/js/PulseLoader.js";
import ProductDetail from '@/components/Products/ProductDetail.vue';
import ProductList from '@/components/Products/ProductList.vue';
import LoadingSpinner from "@/components/Products/LoadingSpinner.vue";
import productService from "@/services/product.service";
import order_detailService from "@/services/order_detail.service";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import cartService from "@/services/cart.service";
import reviewService from "@/services/review.service";
import { useCartStore } from "@/stores/cart";
import { useFavoriteStore } from "@/stores/favorite";
import { showSuccess, showSuccessMessage } from "@/helpers/NotificationHelper";
import { formatCurrency } from "../helpers/UtilHelper.js";

const { loading, spinnerStyle, spinnerDelay1, spinnerDelay2, spinnerDelay3 } = usePulseLoader();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();
const authStore = useAuthStore();
const product = ref([]);
const route = useRoute();
const router = useRouter();
const productId = computed(() => route.params.id);
const productDetail = ref([]);
const listProductByCategory = ref([]);

const img_1 = ref("");
const img_2 = ref("");
const img_3 = ref("");
const rateComment = ref();
const quantity = ref(1);
const commentValue = ref("");
const isReviewProduct = ref(true);
const isBuyingProduct = ref(false);
const listCommentReview = ref([]);
const currentPage = ref(1);
const pageSize = 6;
const averageRating = ref(0);

const categoryId = ref(0);

const increaseProductViews = async () => {
  try {
    const response = await productService.increaseView(productId.value);
  } catch (error) {
    console.log(error.response);
  }
};

const fetchProduct = async () => {
  try {
    const response = await productService.get(productId.value);
    product.value = response.data;
    categoryId.value = response.data.category_id;
    console.log("category id: ", categoryId.value);
    img_1.value = JSON.parse(product.value.product_img)[0];
    img_2.value = JSON.parse(product.value.product_img)[1];
    img_3.value = JSON.parse(product.value.product_img)[2];
    console.log("Product detail: ", img_1);
  } catch (error) {
    console.log(error.response);
  }
};

const dataReviewByProductLength = ref(0);
const fetchReviewByProduct = async () => {
  try {
    const response = await reviewService.getByProduct(productId.value);
    listCommentReview.value = response.data;
    averageRating.value = response.average_rating;
    dataReviewByProductLength.value = response.length;
  } catch (error) {
    console.log(error.response);
  }
};

const fetchProductByCategoryId = async () => {
  try {
    const response = await productService.getProductFromCategoryId(categoryId.value);
    listProductByCategory.value = response.data;
    console.log(listProductByCategory);
  } catch (error) {
    console.log(error.response);
  }
};

const checkUserReviewProduct = async () => {
  try {
    const response = await reviewService.userHasReviewedProduct(productId.value);
    console.log("Check user review product: ", response);
    isReviewProduct.value = response.data;
  } catch (error) {
    console.log(error.response);
  }
};

onMounted(async () => {
  if(Cookies.get("isUserLoggedIn") == "true"){
    cartStore.fetchCartCount();
  }
  fetchProduct().finally(() => {
    productDetail.value = product.value.product_des.split(".");
    console.log("YEYE: ", productDetail);
    setTimeout(() => {
      fetchProductByCategoryId();

      loading.value = false;
    }, 500);
    if(Cookies.get("isUserLoggedIn") == "true"){
      checkUserReviewProduct();
    }
  });
  if(Cookies.get("isUserLoggedIn") == "true"){
    await favoriteStore.fetchListFavorite().finally(() => {
    updateDetailProductWithLikes();
    })
    increaseProductViews();
    fetchReviewByProduct();
    checkBuyingProduct();
  }
  

  
});

const handleAddToCart = (product_id) => {
  addToCart(product_id);
  showSuccess("Thêm vào giỏ hàng thành công");
};

const handleBuyNow = (product_id) => {
  addToCart(product_id);
  router.push({ name: "cart" });
};

const addToCart = async (product_id) => {
  try {
    const user_id = authStore.user_id;
    const response = await cartService.create({
      user_id: user_id,
      product_id: product_id,
      quantity: quantity.value,
    });
    await cartStore.fetchCartCount();
  } catch (error) {
    console.log(error.response);
  }
};

const deleteFavorite = async (productId) => {
  // console.log(productId);
  try {
    await favoriteStore.deleteFavorite(productId);
    await favoriteStore.fetchListFavorite().finally(() => {
      updateDetailProductWithLikes();
    })
    showSuccessMessage("Đã loại bỏ khỏi danh sách yêu thích");

  } catch (error) {
    console.log(error.response);
  }
};

const createFavorite = async (productId) => {
  try {
    await favoriteStore.createFavorite(productId);
    await favoriteStore.fetchListFavorite().finally
    showSuccessMessage("Thêm vào danh sách yêu thích thành công");
    rateComment.value = 0;
    commentValue.value = 0;
    setTimeout(() => {
      updateDetailProductWithLikes();
    }, 500);
  } catch (error) {
    console.log(error.response);
  }
};

const updateDetailProductWithLikes = () => {
  const isLiked = favoriteStore.listFavorite.some((favorite) => favorite.product_id == productId.value);
  product.value.liked = isLiked;
};


const checkBuyingProduct = async () => {
  try {
    const response = await order_detailService.checkUserPurchasedProduct(productId.value);
    isBuyingProduct.value = response.message;
  } catch (error) {
    console.log(error.response);
  }
};

const handleComment = () => {
  createComment(productId.value, rateComment.value, commentValue.value);
  showSuccess("Cảm ơn bạn đã đánh giá");
  fetchReviewByProduct();
  checkUserReviewProduct();
};

const listCommentPagination = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  return listCommentReview.value?.slice(startIndex, startIndex + pageSize);
});

// const handleCurrentChange = (val) => {
//   currentPage.value = val;
//   console.log(`current page: ${val}`);
// });

watch(productId, () => {
  fetchProduct();
  fetchProductByCategoryId();
  increaseProductViews();
  fetchReviewByProduct();
  checkUserReviewProduct();
  checkBuyingProduct();
});

const createComment = async (productId, rating, comment) => {
  try {
    const response = await reviewService.create({
      product_id: productId,
      rating: rating,
      comment: comment,
    });
    console.log(response);
  } catch (error) {
    console.log(error.response);
  }
};
const incrementQuantity = () => {
  if (quantity.value < 10) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};


</script>

<style scoped>
.breadcrumb-item+.breadcrumb-item::before {
  content: ">";
}

.single_product {
  padding-top: 66px;
  padding-bottom: 140px;
  background-color: #e5e5e5;
  margin-top: 0px;
  padding: 4px;
}

.product_name {
  font-size: 24px;
  font-weight: 600;
  margin-top: 0px;
}

.product-rating {
  margin-top: 10px;
}

.rating-review {
  color: #5b5b5b;
}

.row-underline {
  content: "";
  display: block;
  border-bottom: 2px solid #234A2B;
  margin: 0px 0px;
  margin-bottom: 20px;
  margin-top: 15px;
}

.deal-text {
  margin-left: -10px;
  font-size: 25px;
  margin-bottom: 10px;
  color: #000;
  font-weight: 700;
}

.padding-0 {
  padding-left: 0;
  padding-right: 0;
}

.padding-2 {
  margin-right: 2px;
  margin-left: 2px;
}
</style>