<template>
  <div class="container">
    <div class="single_product">
      <div class="container-fluid" style="background-color: #fff; padding: 11px">
        <ProductDetail :product="product" :productDetail="productDetail" :averageRating="averageRating" :img_1="img_1"
          :img_2="img_2" :img_3="img_3" :quantity="quantity" :loading="loading" @increment-quantity="incrementQuantity"
          @decrement-quantity="decrementQuantity" @add-to-cart="handleAddToCart" @buy-now="handleBuyNow"
          @create-favorite="createFavorite" :inStock="inStock" />

        <LoadingSpinner :loading="loading" :spinnerStyle="spinnerStyle" :spinnerDelay1="spinnerDelay1"
          :spinnerDelay2="spinnerDelay2" :spinnerDelay3="spinnerDelay3" />
        <div class="row row-underline">
          <div class="col-md-6">
            <span class="deal-text">Các sản phẩm có liên quan</span>
          </div>
          <div class="col-md-6"></div>
        </div>
        <ProductList :listProductByCategory="listProductByCategory" :formatCurrency="formatCurrency" />
        <ProductReview :productId="productId" @fetchProduct="fetchProduct" />
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
import ProductReview from '@/components/Products/ProductReview.vue';
import LoadingSpinner from "@/components/Products/LoadingSpinner.vue";
import productService from "@/services/product.service";
import order_detailService from "@/services/order_detail.service";
import batchService from '@/services/batch.service';
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
const inStock = ref(false);

const img_1 = ref("");
const img_2 = ref("");
const img_3 = ref("");
const quantity = ref(1);

const averageRating = ref(0);
const categoryId = ref(0);

const checkInStock = async () => {
  try {
    const response = await batchService.checkProductInStock(productId.value);
    inStock.value = response.data;
    console.log('Check In Stock: ', response);
  } catch (error) {
    console.log(error.response);
  }
}

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
    product.value = response.data[0];
    categoryId.value = response.data[0].category_id;
    console.log("category id: ", categoryId.value);
    img_1.value = JSON.parse(product.value.product_img)[0];
    img_2.value = JSON.parse(product.value.product_img)[1];
    img_3.value = JSON.parse(product.value.product_img)[2];
    console.log("Product detail: ", response);
    return response;
  } catch (error) {
    console.log(error.response);
    throw error;
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

onMounted(async () => {
  if (Cookies.get("isUserLoggedIn") == "true") {
    cartStore.fetchCartCount();
  }
  fetchProduct().finally(() => {
    productDetail.value = product.value.product_des.split(".");
    console.log("YEYE: ", productDetail);
    setTimeout(() => {
      fetchProductByCategoryId();

      loading.value = false;
    }, 600);

  });
  if (Cookies.get("isUserLoggedIn") == "true") {
    await favoriteStore.fetchListFavorite().finally(() => {

    })
    increaseProductViews();
    checkBuyingProduct();
  }

  if (route.query && route.query.ref) {
    Cookies.set('affiliateUserId', route.query.ref);
    Cookies.set('productAffiliateId', productId.value);
  }

  checkInStock();

});

const handleAddToCart = (product_id, weight) => {
  addToCart(product_id, weight).then(() => {
    showSuccess("Thêm vào giỏ hàng thành công");
  })

};

const handleBuyNow = (product_id, weight) => {
  addToCart(product_id, weight);
  router.push({ name: "cart" });
};

const addToCart = async (product_id, weight) => {
  try {
    const user_id = authStore.user_id;
    const response = await cartService.create({
      user_id: user_id,
      product_id: product_id,
      quantity: quantity.value,
      total_weight: weight,
    });
    await cartStore.fetchCartCount();
    return response;
  } catch (error) {
    console.log(error.response);
    throw error;
  }
};


const createFavorite = async (productId) => {
  try {
    const response = await favoriteStore.createFavorite(productId);
    if (response.status === 'created') {
      showSuccessMessage("Đã thêm vào mục yêu thích");
      fetchProduct().then(() => {
        productDetail.value = product.value.product_des.split(".");
      });
    } else {
      showSuccessMessage("Đã xóa khỏi mục yêu thích");
      fetchProduct().then(() => {
        productDetail.value = product.value.product_des.split(".");
      });
    }
  } catch (error) {
    console.log(error.response);
  }
};


const checkBuyingProduct = async () => {
  try {
    const response = await order_detailService.checkUserPurchasedProduct(productId.value);
    isBuyingProduct.value = response.message;
  } catch (error) {
    console.log(error.response);
  }
};

watch(productId, (newVal) => {
  if (newVal) {
    fetchProduct().then(() => {
      productDetail.value = product.value.product_des.split(".");
    });
    fetchProductByCategoryId();
    increaseProductViews();
  }
});

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