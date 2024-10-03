<template>
  <section class="h-100 gradient-custom">
    <div class="container py-2 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-10 col-xl-8">
          <div class="card" style="border-radius: 10px">
            <div class="card-header px-4 py-3">
              <h5 class="text-muted mb-2" style="font-weight: 600;">
                Đơn hàng của bạn,
                <span style="color: #a8729a">{{ address.name }}</span>!
              </h5>
              <el-steps v-show="order.status != 'cancelled'"
                :active="(order.status == 'preparing') ? 1 : order.status == 'shipping' ? 2 : 3" align-center>
                <el-step title="Đang chuẩn bị" />
                <el-step title="Đang giao" />
                <el-step title="Đã nhận" />
              </el-steps>
            </div>

            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <p class="lead fw-normal mb-0" style="color: #a8729a">
                  Chi tiết đơn hàng
                </p>
                <p class="small text-muted mb-0">
                  Mã đơn hàng : #{{ order.bill_id }}
                </p>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-4">
                <p></p>
                <p v-show="order.paid === 1 && order.status != 'cancelled'" class="small text-muted mb-0">
                  <el-tag type="success">Đã thanh toán</el-tag>
                </p>
                <p v-show="order.status === 'cancelled'" class="small text-muted mb-0">
                  <el-tag type="danger">Đã hủy</el-tag>
                </p>
              </div>
              <div class="card shadow-0 border mb-4">
                <div class="row">
                  <div class="col-md-2"></div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text fw-bold mb-0">Tên sản phẩm</p>
                  </div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text fw-bold mb-0 small">Số lượng</p>
                  </div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text fw-bold mb-0 small">Kg/sản phẩm</p>
                  </div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text fw-bold mb-0 small">Đơn giá</p>
                  </div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text fw-bold mb-0 small">Tổng</p>
                  </div>
                </div>
                <div class="card-body" v-for="data in order.order_detail" :key="data.order_detail_id">
                  <div class="row">
                    <div class="col-md-2">
                      <router-link :to="{
                        name: 'product-detail',
                        params: { id: data.product.product_id },
                      }">
                        <img :src="'https://dacsancamau.com/storage/' +
                          JSON.parse(data.product.product_img)[0]
                          " class="img-fluid" alt="Phone" />
                      </router-link>
                    </div>
                    <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                      <p class="text-muted mb-0">
                        {{ data.product.product_name }}
                      </p>
                    </div>
                    <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                      <p class="text-muted mb-0 small">x{{ data.quantity }}</p>
                    </div>
                    <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                      <p class="text-muted mb-0 small">1kg</p>
                    </div>
                    <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                      <p class="text-muted mb-0 small">
                        {{ formatCurrency(data.total_cost_detail / data.quantity) }}/kg
                      </p>
                    </div>
                    <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                      <p class="text-muted mb-0 small">
                        {{
                          formatCurrency(
                            data.total_cost_detail
                          )
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between pt-2">
                <p class="fw-bold mb-0">Chi tiết</p>
                <p class="text-muted mb-0">
                  <span class="fw-bold ">Tổng</span>
                  {{ formatCurrency(order.total_cost) }}
                </p>
              </div>

              <div class="d-flex justify-content-between pt-2">
                <p class="text-muted mb-0">
                  <span class="fw-bold">Tên người nhận:</span>
                  {{ address.name }}
                </p>
                <p class="text-muted mb-0">
                  <span class="fw-bold me-4">Phí giao hàng</span>
                  {{ formatCurrency(order.shipping_fee) }}
                </p>
              </div>

              <div class="d-flex justify-content-between">
                <p class="text-muted mb-0">
                  <span class="fw-bold">Số điện thoại:</span>
                  {{ address.phone }}
                </p>
                <p class="text-muted mb-0">
                  <span class="fw-bold me-4">Điểm dùng</span>
                  - {{ order.point_used_order }} (
                  {{ formatCurrency(order.point_used_order * 1000) }})
                </p>
              </div>

              <div class="d-flex justify-content-between mb-0">
                <p class="text-muted mb-0">
                  <span class="fw-bold">Địa chỉ:</span>
                  {{ address.address }}, {{ address.commue }},
                  {{ address.district }}, {{ address.city }}
                </p>
                <p class="text-muted mb-0">

                </p>
              </div>
              <div class="d-flex justify-content-between">
                <p class="text-muted mb-0">
                  <span class="fw-bold">Ngày đặt:</span>
                  {{ covertTime(order.created_at) }}
                </p>
              </div>
            </div>

            <div class="text-center my-1" v-show="order.status == 'preparing'">
              <el-button v-show="order.paid == 0" size="large" @click="centerDialogVisible1 = true"><span
                  style="font-size: 20px">Hủy đơn
                  hàng</span></el-button>
              <el-button v-show="order.paid == 1" size="large" @click="centerDialogVisible2 = true"><span
                  style="font-size: 20px">Hủy đơn
                  hàng</span></el-button>
            </div>
            <el-dialog v-model="centerDialogVisible1" width="500" align-center>
              <span>Bạn có chắc chắn muốn hủy đơn hàng</span>
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="centerDialogVisible1 = false">Trở lại</el-button>
                  <el-button style="background-color: #234A2B; color: white;" @click="handleCancelOrder(orderId)">
                    Đồng ý
                  </el-button>
                </div>
              </template>
            </el-dialog>
            <el-dialog v-model="centerDialogVisible2" width="500" align-center>
              <span style="font-weight: 600;">Bạn có chắc chắn muốn hủy đơn hàng</span>
              <p style="font-style: italic;">Do đơn hàng của bạn đã được thanh toán nên nếu bạn hủy đơn hàng thì thời
                gian hoàn lại
                tiền sẽ từ 1 - 3
                ngày</p>
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="centerDialogVisible2 = false">Trở lại</el-button>
                  <el-button style="background-color: #234A2B; color: white;" @click="handleCancelOrder(orderId)">
                    Đồng ý
                  </el-button>
                </div>
              </template>
            </el-dialog>
            <div class="card-footer border-0 px-4 py-2" style="
                  background-color: #234A2B !important;
                  border-bottom-left-radius: 10px;
                  border-bottom-right-radius: 10px;
                ">
              <h5 class="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">
                TỔNG PHẢI THANH TOÁN:
                <span class="h2 mb-0 ms-2">{{
                  formatCurrency(order.total_cost)
                }}</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import orderService from "@/services/order.service";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElLoading, ElNotification, ElMessage } from "element-plus";
import userService from "@/services/user.service";
import order_detailService from "../services/order_detail.service";
import refundService from "../services/refund.service";
import { initializeEcho } from "../pusher/echoConfig";

const echoInstance = initializeEcho();
echoInstance.channel('admin-channel')
  .listen('.order.update.status', async (event) => {
    fetchOrder();

  });
const centerDialogVisible1 = ref(false);
const centerDialogVisible2 = ref(false);
const order = ref([]);
const address = ref([]);
const route = useRoute();
const router = useRouter();
const orderId = route.params.id;
const productIncrease = ref([]);
const fetchOrder = async () => {
  try {
    const response = await orderService.get(orderId);
    order.value = response.data;
    address.value = JSON.parse(response.data.order_address);
    productIncrease.value = response.data.order_detail;
    console.log("Detail of order: ", response);
  } catch (error) {
    console.log(error.response);
  }
};

const handleCancelOrder = async (orderId) => {
  try {
    const response = await orderService.cancel(orderId);
    if (order.value.paid == 1) {

      handleCreateRefund({
        order_id: orderId,
        bill_id: order.value.bill_id
      });
    }
    centerDialogVisible1.value = false;
    centerDialogVisible2.value = false;
    const loading = ElLoading.service({
      lock: true,
      text: "Đang xử lý...",
      background: "rgba(0,0,0, 0.7)",
    });
    await userService.restorePointPaid({
      point_paid: order.value.point_used_order,
    });
    await order_detailService.revertStock(orderId);
    setTimeout(() => {
      loading.close();
      showCancelSuccess();
      setTimeout(() => {
        router.push({ name: "profile" });
      }, 1000);
    }, 2000);
  } catch (error) {
    console.log(error.response);
  }
};

const handleCreateRefund = async (orderId) => {
  try {
    const response = await refundService.create(orderId);
    console.log(response);
  } catch (error) {
    console.log(error.response);
  }
};

const showCancelSuccess = () => {
  ElMessage({
    message: "Hủy dơn hàng thành công.",
    type: "success",
  });
};

onMounted(() => {
  fetchOrder();
});
const formatCurrency = (amount) => {
  return (
    amount?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }) || ""
  );
};

const covertTime = (dateTimeString) => {
  var dateTime = moment(dateTimeString);
  dateTime.utcOffset(7);

  var formattedDateTime = dateTime.format("DD/MM/YYYY HH:mm:ss");
  return formattedDateTime;
};
</script>

<style scoped></style>