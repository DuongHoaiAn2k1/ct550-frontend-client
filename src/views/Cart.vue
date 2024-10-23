<template>
  <div class="container">
    <h3 style="
          font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
            sans-serif;
        ">
      GIỎ HÀNG CỦA BẠN
    </h3>
    <div class="row py-2" style="background-color: white;">
      <div class="col-xl-8">
        <div class="border shadow-none">
          <CartItem v-for="cart in cartData" :key="cart.cart_id" :cart="cart" @delete="handldeDelete"
            @increment="incrementQuantity" @decrement="decrementQuantity" />
        </div>

        <div class="row my-4 ">
          <div class="col-sm-6">
            <router-link v-show="cartStore.count != 0" :to="{ name: 'home' }" class="btn btn-link text-muted">
              <i class="fa-solid fa-arrow-right"></i> Tiếp tục mua hàng
            </router-link>

          </div>
        </div>

        <!-- end row-->
      </div>

      <div class="col-xl-4 ">
        <div class="border shadow-none">
          <CartDetails v-if="cartStore.count != 0" :total="total" :number="number" :listAddress="listAddress"
            :addressToPay.sync="addressToPay" :addressError="addressError" @update:addressToPay="addressToPay = $event"
            @redirectPayment="hanleRedirectPayment" />
        </div>

      </div>
      <div v-show="cartStore.count == 0" class=" row text-center">
        <p><span style="font-size: 24px; font-weight: 600;">Giỏ hàng của bạn trống!!!</span></p>
        <img src="https://www.fudcoshop.com/pub/static/frontend/MageBig/martfury_layout04/en_GB/images/empty-cart.svg"
          alt="" width="500">
      </div>
    </div>

    <!-- end row -->
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { useProductStore } from "@/stores/product";
import { onMounted, watchEffect } from "vue";
import CartItem from "@/components/Carts/CartItem.vue";
import CartDetails from "@/components/Carts/CartDetails.vue";
import cartService from "@/services/cart.service";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showWarning } from "@/helpers/NotificationHelper";
import userService from "@/services/user.service";
import { h } from 'vue'
import { ElNotification } from 'element-plus'
const atob = (str) => window.atob(str);

const authStore = useAuthStore();
const cartStore = useCartStore();
const productStore = useProductStore();
const addressError = ref(null);
const cartData = ref([]);
const total = ref(0);
const number = ref(0);
const listAddress = ref([]);
const router = useRouter();

// Index của địa chỉ trong address json
const addressToPay = ref(-1);


const fetchUserData = async () => {
  try {
    const response = await userService.get(authStore.user_id);
    listAddress.value = JSON.parse(response.data.address);
    console.log("User Data Address: ", listAddress.value);
  } catch (error) {
    console.log(error.response);
  }
};

const fetchCartData = async () => {
  try {
    const response = await cartService.get(authStore.user_id);
    cartData.value = response.data;
    console.log("Cart Data: ", response);
  } catch (error) {
    console.log(error.response);
  }
};

const handleIncrease = async (id) => {
  try {
    const response = await cartService.increase(id);
  } catch (error) {
    console.log(error.response);
  }
};

const handleDecrease = async (id) => {
  try {
    const response = await cartService.decrease(id);
  } catch (error) {
    console.log(error.response);
  }
};

const handldeDelete = async (id) => {
  try {
    const response = await cartService.delete(id);
    fetchCartData();
    await cartStore.fetchCartCount();
  } catch (error) {
    console.log(error.response);
  }
};

const hanldeTotal = () => {
  total.value = 0;
  number.value = 0;
  cartData.value.forEach((cart) => {
    number.value = number.value + cart.quantity;
    if (cart?.product && cart.product.product_promotion) {

      total.value = total.value + (cart.product.product_price - cart.product.product_promotion[0].discount_price) * cart.quantity;
    } else {
      total.value =
        total.value +
        cart.product.product_price * cart.quantity;
    }

  });

  console.log("Total: ", total.value);
};

const hanleRedirectPayment = () => {
  if (addressToPay.value === -1 && listAddress.value != null) {
    addressError.value = "Địa chỉ không được để trống";
  } else if (addressToPay.value === -1 && listAddress.value == null) {
    showAddressNotification();
  }
  else if (addressToPay.value !== -1 || addressToPay.value === 0) {
    addressError.value = "";
    cartStore.setAddress(addressToPay.value);
    router.push({ name: "payment" });
  }
};
onMounted(async () => {
  await productStore.fetchListProduct();
  fetchCartData().then(() => {
    hanldeTotal();
  });
  fetchUserData();

});

const incrementQuantity = (cartItem) => {
  if (cartItem.quantity < 10) {
    cartItem.quantity += 1;
    handleIncrease(cartItem.cart_id);
    hanldeTotal();
  } else {
    showWarning("Đã quá số lượng sản phẩm cho phép");
  }
};

const decrementQuantity = (cartItem) => {
  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
    handleDecrease(cartItem.cart_id);
    hanldeTotal();
  } else {
    showWarning("Đã quá đạt số lượng tối thiểu");
  }
};

const showAddressNotification = () => {
  ElNotification({
    title: 'Bạn chưa có địa chỉ nào!',
    message: h('button', { style: 'color: teal', style: 'background-color: #234A2B', class: 'btn btn-primary', onClick: () => { router.push({ name: 'profile' }) } }, 'Tiến hành thêm địa chỉ'),
    duration: 2000
  })
}
</script>

<style scoped>
.avatar-lg {
  height: 5rem;
  width: 5rem;
}

.font-size-18 {
  font-size: 18px !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

a {
  text-decoration: none !important;
}

.w-xl {
  min-width: 160px;
}

.card {
  margin-bottom: 24px;
  -webkit-box-shadow: 0 2px 3px #e4e8f0;
  box-shadow: 0 2px 3px #e4e8f0;
}

.card {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid #eff0f2;
  border-radius: 1rem;
}

/* Thêm một lớp 'text-truncate' để hiển thị dấu '...' */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* Đặt chiều rộng để kiểm soát kích thước của hộp select */
  width: 100%;
  /* Bạn có thể điều chỉnh giá trị này theo nhu cầu */
}
</style>