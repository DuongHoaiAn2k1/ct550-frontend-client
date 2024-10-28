<template>
  <div class="container-fluid">
    <div class="container">
      <!-- Title -->
      <div class="d-flex justify-content-between align-items-center py-2">
        <h2 class="h5 mb-0">
          <a href="#" class="text-muted"></a> Đơn hàng #{{ bill_id }}
        </h2>
      </div>

      <!-- Main content -->
      <div class="row">
        <div class="col-lg-8">
          <!-- Details -->
          <div class="mb-4">
            <div class="card-body">
              <div class="mb-3 d-flex justify-content-between">
                <div>
                  <span class="me-3">{{ day }}-{{ month }}-{{ years }}</span>
                  <span class="me-3"> #{{ bill_id }}</span>
                  <span class="badge rounded-pill bg-info">SHIPPING</span>
                </div>
                <div class="d-flex">
                  <button class="btn btn-link p-0 me-3 d-none d-lg-block btn-icon-text">
                    <i class="bi bi-download"></i>
                  </button>
                  <div class="dropdown">
                    <button class="btn btn-link p-0 text-muted" type="button" data-bs-toggle="dropdown">
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li>
                        <a class="dropdown-item" href="#"><i class="bi bi-pencil"></i> Edit</a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#"><i class="bi bi-printer"></i> Print</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <table class="table table-borderless">
                <tbody>
                  <tr v-for="(data, index) in cartData">
                    <td>
                      <div class="d-flex mb-2">
                        <div class="flex-shrink-0">{{ index + 1 }}</div>
                        <div class="flex-lg-grow-1 ms-3">
                          <h6 class="small mb-0">
                            <a href="#" class="text-reset">{{
                              data.product.product_name
                            }}</a>
                          </h6>
                          <span class="small">Giá:
                            {{
                              data.product.product_promotion &&
                                data.product?.product_promotion.length > 0
                                ? formatCurrency(data.product?.product_price -
                                  data.product?.product_promotion[0].discount_price) :
                                formatCurrency(data.product?.product_price)
                            }}</span>
                        </div>
                      </div>
                    </td>
                    <td>x{{ data.quantity }}</td>
                    <td class="text-end">
                      {{
                        data.product.product_promotion &&
                          data.product?.product_promotion.length > 0
                          ? formatCurrency((data.product?.product_price -
                            data.product?.product_promotion[0].discount_price) * data.quantity) :
                          formatCurrency(data.product?.product_price * data.quantity)
                      }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2">Tổng tiền</td>
                    <td class="text-end">{{ formatCurrency(totalMoney) }}</td>
                  </tr>
                  <tr>
                    <td colspan="2">Tổng trọng lượng</td>
                    <td class="text-end">{{ totalWeight }} kg</td>
                  </tr>
                  <tr>
                    <td colspan="2">Phí vận chuyển</td>
                    <td class="text-end">
                      {{ formatCurrency(shippingFee) }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">Điểm sử dụng</td>
                    <td class="text-end text-danger">
                      -{{ formatCurrency(pointUsed * 1000) }} &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">Điểm tích lũy</td>
                    <td class="text-end">
                      +{{ point }} điểm &nbsp;
                      <span data-bs-toggle="tooltip" data-bs-placement="bottom"
                        title="Đối với các đơn hàng trên 1 triệu sẽ được cộng 10 điểm tích lũy">
                        <i class="fa-solid fa-circle-info"></i>
                      </span>
                    </td>
                  </tr>
                  <tr class="fw-bold">
                    <td colspan="2">TỔNG</td>
                    <td class="text-end">
                      {{
                        formatCurrency(
                          totalMoney -
                          pointUsed * 1000 +
                          shippingFee
                        )
                      }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="mb-2 p-2">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <h3 class="h6">
                    <span style="font-weight: 600">Tên người nhận:</span>
                    {{ addressOrder.name }}
                  </h3>
                  <h3 class="h6">
                    <span style="font-weight: 600">Địa chỉ nhận hàng:</span>
                    {{ addressOrder.address }}, {{ addressOrder.commue }},
                    {{ addressOrder.district }}, {{ addressOrder.city }}
                  </h3>

                  <h3 class="h6">
                    <span style="font-weight: 600">Số điện thoại:</span>
                    {{ addressOrder.phone }}
                  </h3>

                  <h3 class="h6">
                    <span style="font-weight: 600">Phương thức vận chuyển:</span>
                    <img class="ms-2" src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-H.png" alt=""
                      width="100">
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <!-- Shipping information -->
            <div class="card-body">
              <div class="row">
                <div class="col-lg-6">
                  <h3 class="h6" style="font-weight: 600;">Phương thức thanh toán</h3>
                </div>
              </div>
              <div class="row">
                <div class="d-flex flex-row pb-3">
                  <div class="d-flex align-items-center pe-2">
                    <input class="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel1" value="cod"
                      v-model="payMethod" aria-label="..." checked />
                  </div>
                  <label class="rounded border d-flex w-100 p-3 align-items-center" for="radioNoLabel1">
                    <i class="fa-solid fa-truck"></i>
                    Thanh toán khi nhận hàng
                  </label>
                </div>


                <div class="d-flex flex-row">
                  <div class="d-flex align-items-center pe-2">
                    <input class="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel2" value="vnpay"
                      aria-label="..." v-model="payMethod" />
                  </div>
                  <div class="rounded border d-flex w-100 p-3 align-items-center">
                    <label class="mb-0" for="radioNoLabel2">
                      <i class="fab fa-cc-mastercard fa-lg text-dark pe-2"></i>Thanh toán online VNPay
                    </label>
                  </div>
                </div>
              </div>
              <div class="row mt-2">
                <div class="input-group mb-3">
                  <span class="input-group-text fw-bold" id="inputGroup-sizing-default">Sử dụng điểm tích lũy</span>
                  <input type="text" class="form-control" aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default" v-model="pointUsed" maxlength="6" />

                </div>
              </div>
              <div class="row">
                <div class="mt-2 text-center">
                  <button @click="preprocessOrder" class="btn btn-dark btn-block btn-lg">
                    ĐẶT HÀNG
                    <i class="fas fa-long-arrow-alt-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { showLoading } from "@/helpers/LoadingHelper";
import { showSuccess, showWarning, showError } from "@/helpers/NotificationHelper";
import { formatCurrency } from "@/helpers/UtilHelper";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useProductStore } from "@/stores/product";
import { onMounted, ref, watch } from "vue";
import orderService from "@/services/order.service";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import productService from "@/services/product.service";
import cartService from "@/services/cart.service";
import userService from "@/services/user.service";
import shippingService from "../services/shipping.service";
import order_detailService from "@/services/order_detail.service";
import batchService from "../services/batch.service";
import paymentService from "../services/payment.service";
import affiliateService from "../services/affiliate.service";

const orderGet = ref([]);
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const productStore = useProductStore();
const bill_id = ref("");
const currentDay = new Date();
const day = currentDay.getDate();
const month = currentDay.getMonth() + 1;
const years = currentDay.getFullYear();
const listProduct = ref([]);
const cartData = ref([]);
const userData = ref([]);
const ListAddressOrder = ref([]);
const addressOrder = ref([]);
const totalMoney = ref(0);
const totalWeight = ref(0);
const shippingFee = ref(0);
const number = ref(0);
const point = ref(0);
const pointUsed = ref(0);
const currentPoint = ref(0);
const payMethod = ref("cod");
const checkStockResult = ref('');
const loading = showLoading();

const checkStockAvailable = async (data) => {
  try {
    const response = await batchService.checkStockAvailability({ products: data });
    // console.log("Cart data to check: ", data);
    // console.log("Check Stock: ", response);
    checkStockResult.value = response.status;
    // console.log(checkStockResult.value);
  } catch (error) {
    console.log(error.response);
    showWarning('Có sản phẩm không còn đủ số lượng trong kho');
  }
}

const orderData = ref({});

const fetchListProduct = async () => {
  try {
    const response = await productService.getAll();
    listProduct.value = response.listProduct;
    // console.log(listProduct);
  } catch (error) {
    console.log(error.response);
  }
};

const fetchOrder = async () => {
  try {
    const response = await orderService.getByBillId(Cookies.get("recentOrderBillId"));
    orderGet.value = response.data;
    console.log('Order Get: ', orderGet.value);
    return response;
  } catch (error) {
    console.log(error.response);
    throw error;
  }
}

const fetchUserData = async () => {
  try {
    const response = await userService.get(authStore.user_id);
    userData.value = response.data;
    ListAddressOrder.value = JSON.parse(response.data.address);
    addressOrder.value = ListAddressOrder.value[cartStore.addressToPay];
    // console.log("user data: ", ListAddressOrder);
    return response;
  } catch (error) {
    console.log(error.response);

    throw error;
  }
};

const fetchCartData = async () => {
  try {
    const response = await cartService.get();
    cartData.value = response.data;
    // console.log('Cart Data: ', cartData);
    return response;
  } catch (error) {
    console.log(error.response);
    throw error;
  }
};

const fetchCurrentPoint = async () => {
  try {
    const response = await userService.getCurrentPoint();
    currentPoint.value = response.point;
    // console.log("Current Point: ", response);
  } catch (error) {
    console.log(error.response);
  }
};

const handleCreateSale = async (orderId, quantity) => {
  try {
    const response = await affiliateService.createSale({
      affiliate_user_id: Cookies.get('affiliateUserId'),
      product_id: Cookies.get('productAffiliateId'),
      order_id: orderId,
      quantity: quantity
    });
    console.log("After create sale: ", response);
  } catch (error) {
    console.log(error.response);
  }
}

const affiliateProductQuantity = ref(0);

const handleTotal = () => {
  totalMoney.value = 0;
  totalWeight.value = 0;
  number.value = 0;
  cartData.value.forEach((cart) => {
    totalWeight.value = totalWeight.value + cart?.product?.weight * cart.quantity;
    number.value = number.value + cart.quantity;
    if (Cookies.get('affiliateUserId') && Cookies.get('productAffiliateId') && Cookies.get('productAffiliateId') == cart.product_id) {
      // handleCreateSale(cart.order_id, cart.quantity);
      affiliateProductQuantity.value = cart.quantity;
    }

    if (cart.product.product_promotion && cart.product.product_promotion.length > 0) {
      totalMoney.value =
        totalMoney.value +
        (cart?.product?.product_price - cart?.product?.product_promotion[0].discount_price) * cart.quantity;
    } else {
      totalMoney.value =
        totalMoney.value +
        cart?.product?.product_price * cart.quantity;
    }
  });

  if (
    totalMoney.value -
    pointUsed.value * 1000 + shippingFee.value >=
    1000000
  ) {
    point.value = 10;
  }
};

const handleDeleteCart = async () => {
  try {
    const response = await cartService.deleteAll();
    // console.log(response);
  } catch (error) {
    console.log(error.response);
  }
};


const preprocessOrder = async () => {
  checkStockAvailable(cartData.value).then(async () => {
    if (checkStockResult.value == "success") {
      // alert("Success")
      if (payMethod.value == "cod") {
        handleOrder("preparing");
      } else {
        let now = new Date(currentDay.getTime() + 25 * 60000);
        // Lấy thông tin ngày giờ sau khi cộng thêm
        let day = now.getDate();
        let month = now.getMonth() + 1;
        let year = now.getFullYear();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();

        // Định dạng ngày, tháng, giờ, phút, giây
        let monthStr = month.toString().padStart(2, '0');
        let dayStr = day.toString().padStart(2, '0');
        let hourStr = hour.toString().padStart(2, '0');
        let minuteStr = minute.toString().padStart(2, '0');
        let secondStr = second.toString().padStart(2, '0');
        const response = await paymentService.createPayment({
          order_id: bill_id.value,
          order_desc: "Thanh toán đơn hàng #" + bill_id.value,
          order_type: "billpayment",
          amount: totalMoney.value - pointUsed.value * 1000 + shippingFee.value,
          language: "vn",
          txtexpire: year + monthStr + dayStr + hourStr + minuteStr + secondStr,
          txt_billing_mobile: addressOrder.value.phone,
          txt_billing_email: Cookies.get("email"),
          txt_billing_fullname: addressOrder.value.name,
          txt_inv_addr1: addressOrder.value.address + ", " + addressOrder.value.commue + ", " + addressOrder.value.district + ", " + addressOrder.value.city,
          txt_bill_city: addressOrder.value.city,
          txt_bill_country: 'Việt Nam',
          txt_inv_mobile: addressOrder.value.phone,
          txt_inv_email: Cookies.get("email"),
          txt_inv_customer: addressOrder.value.name,
          cbo_inv_type: 'I'
        })

        if (response.code == '00') {
          Cookies.set("recentOrderBillId", bill_id.value);
          handleOrder('pending_payment').then(() => {
            handleDeleteCart();
            cartStore.deleteCart();
            window.location.href = response.data;
          })

        }
      }
    }
  })
}

const handleOrder = async (status) => {
  try {
    // Chuẩn bị dữ liệu đơn hàng
    orderData.value.bill_id = bill_id;
    orderData.value.status = status;
    orderData.value.name = addressOrder.value.name;
    orderData.value.phone = addressOrder.value.phone;
    orderData.value.address = addressOrder.value.address;
    orderData.value.commue = addressOrder.value.commue;
    orderData.value.district = addressOrder.value.district;
    orderData.value.city = addressOrder.value.city;
    orderData.value.paid = false;  // Cập nhật giá trị thanh toán
    orderData.value.shipping_fee = shippingFee.value;
    orderData.value.total_cost =
      totalMoney.value - pointUsed.value * 1000 + shippingFee.value;
    orderData.value.pay_method = payMethod.value;
    orderData.value.point_used_order = pointUsed.value;

    if (pointUsed.value != 0 && pointUsed.value > currentPoint.value) {
      showWarning(
        "Điểm sử dụng đã vượt quá điểm tích lũy. Điểm hiện tại của bạn là: " +
        currentPoint.value +
        ""
      );

      throw new Error("Not enough point");
    } else {
      orderData.value.order_details = cartData.value.map((item) => {
        var totalCostDetail = 0;

        if (item.product.product_promotion && item.product?.product_promotion.length > 0) {
          totalCostDetail =
            (item.product?.product_price -
              item.product?.product_promotion[0]?.discount_price) *
            item.quantity;
        } else {
          totalCostDetail = item.product?.product_price * item.quantity;
        }

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          total_cost_detail: totalCostDetail,
        };
      });

      const orderResponse = await orderService.create(orderData.value);

      if (orderResponse && orderResponse.order_id) {
        const order_id = orderResponse.order_id;

        // Nếu có mã affiliateUserId thì xử lý sale
        if (Cookies.get("affiliateUserId")) {
          handleCreateSale(order_id, affiliateProductQuantity.value);
        }

        // Nếu trạng thái là 'preparing', gửi email xác nhận đơn hàng
        if (status == "preparing") {
          orderService.sendOrderConfirmationEmail(order_id);
        }
        // Xử lý với phương thức thanh toán là COD
        if (payMethod.value == "cod") {
          const loadingNotification = showLoading();
          setTimeout(() => {
            showSuccess("Đặt hàng thành công");
            loadingNotification.close();
            setTimeout(() => {
              handleDeleteCart();
              cartStore.deleteCart(); // Xóa giỏ hàng sau khi đặt hàng thành công
              notificationStore.getByUser();
              router.push({ name: "profile" });
            }, 500);
          }, 2000);
        }

        console.log("Order data after create: ", orderResponse);
      } else {
        // Xử lý nếu tạo đơn hàng không thành công
        showWarning("Không thể tạo đơn hàng. Vui lòng thử lại sau.");
      }
    }
  } catch (error) {
    console.log(error.response);
    // showError(error.response.message);
    throw error;
  }
};


const handleCalculateShippingFee = async () => {
  try {
    const response = await shippingService.getFee({
      weight: totalWeight.value,
      value: totalMoney.value,
      province: addressOrder.value.city,
      district: addressOrder.value.district,
      address: addressOrder.address + ", " + addressOrder.commue
    });
    shippingFee.value = response.fee.fee;
    // console.log("Shipping fee: ", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

onMounted(() => {
  const now = new Date();
  const formattedDate = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  bill_id.value = formattedDate + authStore.user_id;

  fetchListProduct();
  fetchUserData().then(() => {
    fetchCartData().then(() => {
      handleCalculateShippingFee().then(() => {
        handleTotal();
        loading.close();
      })
    })
  });
  fetchCurrentPoint();
  productStore.fetchListProduct();

  fetchOrder().then(() => {
    if (orderGet.value && orderGet.value.status == 'pending_payment') {
      router.push({ name: 'order-detail', params: { id: orderGet.value.order_id } });
    }
  });

  // console.log("Order Get : ", orderGet);
  // console.log(cartStore.addressToPay);
});

watch(pointUsed, (newValue) => {
  if (newValue) {
    const loading = showLoading();
    setTimeout(() => {
      loading.close();
    }, 500);
  }
})
</script>

<style>
body {
  background: #eee;
}

.card {
  box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 0 solid rgba(0, 0, 0, 0.125);
  border-radius: 1rem;
}

.text-reset {
  --bs-text-opacity: 1;
  color: inherit !important;
}

a {
  color: #5465ff;
  text-decoration: none;
}
</style>