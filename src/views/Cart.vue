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
          <CartItem v-for="cart in cartData" :key="cart.cart_id" :cart="cart" @delete="handleDelete"
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
            :addressToPay.sync="addressToPay" :addressError="addressListError"
            @update:addressToPay="addressToPay = $event" @redirectPayment="hanleRedirectPayment" />
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

  <el-dialog v-model="isAddressModalVisible" width="600px" title="Thêm địa chỉ mới">
    <div class="modal-body">
      <div class="table-responsive">
        <table class="table table-bordered mb-0">
          <tbody>
            <tr>
              <th scope="row">Họ và tên</th>
              <td>
                <input type="text" name="name" v-model="addressInfoData.name" placeholder="Vui lòng nhập họ tên" />
              </td>
            </tr>
            <span class="text-danger">{{ nameError }}</span>
            <tr>
              <th scope="row">Số điện thoại</th>
              <td>
                <input type="text" name="phone" v-model="addressInfoData.phone"
                  placeholder="Vui lòng nhập số điện thoại" maxlength="10" />
              </td>
            </tr>
            <span class="text-danger">{{ phoneError }}</span>
            <tr>
              <th scope="row">Tỉnh/Thành phố</th>
              <td>
                <select name="city" id="city" v-model="cityAddress">
                  <option value="0">--Chọn tỉnh/thành phố--</option>
                  <option v-for="data in addressData.data" :value="data.level1_id" :key="data.level1_id">
                    {{ data.name }}
                  </option>
                </select>
              </td>
            </tr>
            <span class="text-danger">{{ cityError }}</span>
            <!-- end tr -->
            <tr>
              <th scope="row">Quận/Huyện</th>
              <td>
                <select v-show="cityAddress" name="district" id="district" v-model="districtAddress">
                  <option value="0">--Quận/Huyện--</option>
                  <option v-for="data in listDistrict" :value="data.level2_id" :key="data.level2_id">
                    {{ data.name }}
                  </option>
                </select>
              </td>
            </tr>
            <span class="text-danger">{{ districtError }}</span>
            <tr>
              <th scope="row">Phường/Xã</th>
              <td>
                <select v-show="districtAddress" name="commue" id="commue" v-model="commueAddress">
                  <option value="0">--Phường/Xã--</option>
                  <option v-for="data in listCommune" :value="data.level3_id" :key="data.level3_id">
                    {{ data.name }}
                  </option>
                </select>
              </td>
            </tr>
            <span class="text-danger">{{ commueError }}</span>
            <tr>
              <th scope="row">Địa chỉ cụ thể</th>
              <td>
                <input type="text" name="address" v-model="addressInfoData.address" />
              </td>
            </tr>
            <span class="text-danger">{{ addressError }}</span>
            <!-- end tr -->
          </tbody>
          <!-- end tbody -->
        </table>
        <!-- end table -->
      </div>
    </div>

    <template #footer>
      <el-button @click="isAddressModalVisible = false">Đóng</el-button>
      <el-button type="primary" @click="handleCreateAddress">Thêm</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import * as Yup from "yup";
import addressData from "@/assets/address/dvhc.json";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { useProductStore } from "@/stores/product";
import { onMounted, watchEffect, watch, reactive } from "vue";
import CartItem from "@/components/Carts/CartItem.vue";
import CartDetails from "@/components/Carts/CartDetails.vue";
import cartService from "@/services/cart.service";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showWarning } from "@/helpers/NotificationHelper";
import userService from "@/services/user.service";
import { h } from 'vue'
import { ElNotification } from 'element-plus'
import { showSuccessMessage, showInfo } from "../helpers/NotificationHelper";
import { showLoading } from "../helpers/LoadingHelper";

const authStore = useAuthStore();
const cartStore = useCartStore();
const productStore = useProductStore();
const addressListError = ref(null);
const cartData = ref([]);
const total = ref(0);
const number = ref(0);
const listAddress = ref([]);
const router = useRouter();
const isAddressModalVisible = ref(false);

// Index của địa chỉ trong address json
const addressToPay = ref(-1);

const schema = Yup.object().shape({
  name: Yup.string().required("Họ và tên không được để trống"),
  phone: Yup.string()
    .matches(/^\d+$/, "Số điện thoại chỉ được chứa số")
    .min(10, "Số điện thoại phải 10 ký tự")
    .max(10, "Số điện thoại phải 10 ký tự")
    .required("Số điện thoại không được để trống"),
  city: Yup.string().required("Tỉnh thành phố không được để trống"),
  district: Yup.string().required("Quận huyện không được để trống"),
  commue: Yup.string().required("Xã phường không được để trống"),
  address: Yup.string().required("Địa chỉ cụ thể không được để trống"),
});

const addressInfoData = reactive({
  name: "",
  phone: "",
  city: "",
  district: "",
  commue: "",
  address: "",
});

const cityAddress = ref(0);
const districtAddress = ref(0);
const commueAddress = ref(0);
const listDistrict = ref([]);
const listCommune = ref([]);

const getDataDistric = (id) => {
  return addressData.data.filter((data) => data.level1_id === id);
};

const getDataCommune = (id) => {
  return listDistrict.value.filter((data) => data.level2_id === id);
};

const getNameCommune = (id) => {
  return listCommune.value.filter((data) => data.level3_id === id);
};
const createAddress = async (data) => {
  try {
    const response = await userService.createAddress(data);
    addressInfoData.name = "";
    addressInfoData.phone = "";
    addressInfoData.city = "";
    addressInfoData.district = "";
    addressInfoData.commue = "";
    addressInfoData.address = "";
    cityAddress.value = 0;
    districtAddress.value = 0;
    commueAddress.value = 0;
    listCommune.value = [];
    listDistrict.value = [];
    console.log("After create address: ", response);
  } catch (error) {
    console.log(error.response);
  }
};
const nameError = ref(null);
const phoneError = ref(null);
const cityError = ref(null);
const districtError = ref(null);
const commueError = ref(null);
const addressError = ref(null);
const handleCreateAddress = () => {
  nameError.value = null;
  phoneError.value = null;
  cityError.value = null;
  districtError.value = null;
  commueError.value = null;
  addressError.value = null;
  schema
    .validate(addressInfoData, { abortEarly: false })
    .then(() => {
      nameError.value = null;
      phoneError.value = null;
      cityError.value = null;
      districtError.value = null;
      commueError.value = null;
      addressError.value = null;

      const loading = showLoading();
      createAddress(addressInfoData).then(() => {
        setTimeout(() => {
          loading.close();
          showSuccessMessage("Thêm địa chỉ thành công.");
          fetchUserData();
        }, 1000);
      });
    })
    .catch((errors) => {
      errors.inner.forEach((error) => {
        if (error.path == "name") {
          nameError.value = error.message;
        }
        if (error.path == "phone") {
          phoneError.value = error.message;
        }
        if (error.path == "city") {
          cityError.value = error.message;
        }
        if (error.path == "district") {
          districtError.value = error.message;
        }
        if (error.path == "commue") {
          commueError.value = error.message;
        }
        if (error.path == "address") {
          addressError.value = error.message;
        }
      });
    });
  console.log("The last info: ", addressInfoData);
};


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
    const response = await cartService.get();
    cartData.value = response.data;
    console.log("Cart Data: ", response);

    handleTotal();
  } catch (error) {
    console.log(error.response);
  }
};

const handleIncrease = async (id) => {
  try {
    const response = await cartService.increase(id);
    return response;
  } catch (error) {
    // console.log(error.response);
    throw error;
  }
};

const handleDecrease = async (id) => {
  try {
    const response = await cartService.decrease(id);
  } catch (error) {
    console.log(error.response);
  }
};

const handleDelete = async (id) => {
  try {
    const response = await cartService.delete(id);
    fetchCartData();
    cartStore.fetchCartCount();
    showSuccessMessageMessage('Xóa thành công');
    // console.log(response);
  } catch (error) {
    console.log(error.response);
  }
};

const handleTotal = () => {
  total.value = 0;
  number.value = 0;
  cartData.value.forEach((cart) => {
    number.value = number.value + cart.quantity;
    if (cart?.product && cart.product.product_promotion) {
      total.value = total.value + (cart.product.product_price - cart.product.product_promotion[0].discount_price) * cart.quantity;
    } else if (cart?.product && cart.product.batches) {
      total.value = total.value + (cart.product.product_price - cart.product.batches[0].batch_promotion[0].discount_price) * cart.quantity;
    }
    else {
      total.value =
        total.value +
        cart.product.product_price * cart.quantity;
    }

  });

  console.log("Total: ", total.value);
};

const hanleRedirectPayment = () => {
  if (addressToPay.value == -1 && listAddress.value != null && listAddress.value.length > 0) {
    addressListError.value = "Địa chỉ không được để trống";
  } else if (addressToPay.value == -1 && listAddress.value == null) {
    showAddressNotification();
  }
  else if (addressToPay.value != -1 || addressToPay.value == 0) {
    addressListError.value = "";
    cartStore.setAddress(addressToPay.value);
    router.push({ name: "payment" });
  }
};
onMounted(async () => {
  await productStore.fetchListProduct();
  fetchCartData().then(() => {
    handleTotal();
  });
  fetchUserData();

});

watch(() => addressToPay.value, (newVal) => {
  if (newVal == -2) {
    // alert('NgU');
    isAddressModalVisible.value = true;
    addressToPay.value = -1;
  } else {
    addressListError.value = "";
    nameError.value = null;
    phoneError.value = null;
    cityError.value = null;
    districtError.value = null;
    commueError.value = null;
    addressError.value = null;
  }
});

watch(addressInfoData, (newVal) => {
  if (newVal) {
    nameError.value = null;
    phoneError.value = null;
    cityError.value = null;
    districtError.value = null;
    commueError.value = null;
    addressError.value = null;
  }
})

watch(() => isAddressModalVisible.value, (newVal) => {
  if (newVal == false) {
    addressToPay.value = -1;
  }
})

watchEffect(() => {
  if (cityAddress.value != 0) {
    const district = getDataDistric(cityAddress.value);
    listDistrict.value = district[0].level2s;
    console.log("GET: ", listDistrict);
  }

  if (districtAddress.value != 0) {
    listCommune.value = getDataCommune(districtAddress.value)[0].level3s;
    console.log("Distric address: ", listCommune);
  }

  if (commueAddress.value != 0) {
    // console.log("cityAddress: ", cityAddress.value);
    // console.log("districtAddress: ", districtAddress.value);
    // console.log("commueAddress: ", commueAddress.value);
    addressInfoData.city = getDataDistric(cityAddress.value)[0].name;
    addressInfoData.district = getDataCommune(districtAddress.value)[0].name;
    addressInfoData.commue = getNameCommune(commueAddress.value)[0].name;
  }
});

const incrementQuantity = (cartItem) => {
  // if (cartItem.quantity < 10) {
  cartItem.quantity += 1;
  handleIncrease(cartItem.cart_id).then((response) => {
    if (response.success == 'Create new cart') {
      showInfo('Không còn đủ sản phẩm khuyến mãi. Đã chuyển sang sản phẩm thường')
      fetchCartData();
    }
    handleTotal();
  }).catch((err) => {
    console.log(err.response);
    if (err.response.data.message == 'Sản phẩm đã hết hàng') {
      showWarning("Sản phẩm đã hết hàng");
      cartItem.quantity -= 1;
    }
    if (err.response.data.message == 'Số lượng sản phẩm trong kho không đủ') {
      showWarning("Số lượng sản phẩm trong kho không đủ");
      cartItem.quantity -= 1;
    }
  });
  // } else {
  //   showWarning("Đã quá số lượng sản phẩm cho phép");
  // }
};

const decrementQuantity = (cartItem) => {
  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
    handleDecrease(cartItem.cart_id);
    handleTotal();
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