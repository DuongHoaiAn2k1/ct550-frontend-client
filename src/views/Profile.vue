<template>
  <div class="container mt-1" style="background-color: white">
    <div class="row">
      <div class="col-xl-8">
        <div class="">
          <div class="card-body pb-0">
            <div class="row align-items-center">
              <div class="col-md-3">
                <div class="text-center border-end">
                  <img
                    :src="userData.avatar ? userData.avatar : userData.image ? apiUrl + userData.image : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'"
                    class="img-fluid avatar-xxl rounded-circle" alt="" />
                  <h4 class="text-dark font-size-20 mt-3 mb-2">
                    {{ userData.name }}
                  </h4>
                </div>
              </div>
              <!-- end col -->
              <div class="col-md-9">
                <div class="ms-3">
                  <div>
                    <h4 class="card-title mb-2 design-fontweight-600">Thông tin khách hàng</h4>
                    <div class="table-responsive">
                      <table class="table table-bordered mb-0">
                        <tbody>
                          <tr>
                            <th scope="row">Họ và tên</th>
                            <td>
                              <input style="width: 100%; border: none" type="text" v-model="userData.name" />
                            </td>
                          </tr>
                          <!-- end tr -->
                          <tr>
                            <th scope="row">Email</th>
                            <td>
                              <input style="width: 100%; border: none" type="text" v-model="userData.email" />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Điểm tích lũy</th>
                            <td>{{ userData.point ? userData.point : 0 }}</td>
                          </tr>
                          <tr>
                            <th scope="row">Danh hiệu</th>
                            <td>{{ userData.role == 'normal_user' ? 'Khách hàng' : 'Khách hàng thân thiết' }}</td>
                          </tr>
                          <!-- end tr -->
                        </tbody>
                        <!-- end tbody -->
                      </table>
                      <!-- end table -->
                    </div>
                  </div>
                </div>
              </div>
              <!-- end col -->
            </div>
            <!-- end row -->
          </div>
          <!-- end card body -->
        </div>
        <hr />
        <div class="contain-list-order">
          <div class="tab-content contain-list-order-child">
            <div class="tab-pane px-3 active show" id="tasks-tab" role="tabpanel" style="min-height: 460px;">
              <h4 class="card-title mb-4 design-fontweight-600">Đơn hàng của bạn</h4>
              <!-- <el-scrollbar height="400px"> -->
              <div v-show="orderStore.listOrder.length" class="row order-item" v-for="data in paginatedOrderList"
                :key="data.order_id">
                <div class="col-xl-12 p-0">
                  <div class="task-list-box" id="comp-task">
                    <div id="task-item-4">
                      <div class="task-box rounded-3">
                        <div class="card-body">
                          <div class="row align-item-center">
                            <div class="">Mã đơn hàng:</div>
                          </div>
                          <div class="row align-items-center">
                            <div class="col-xl-3 col-md-6">
                              <div class="font-size-15">
                                <label class="form-check-label task-title" for="customChat">#{{ data.bill_id
                                  }}</label>
                              </div>
                            </div>
                            <!-- end col -->
                            <div class="col-xl-9 col-md-6">
                              <div class="row align-items-center">
                                <div class="col-2 detail-off">
                                  <div class="avatar-group mt-3 mt-xl-0 task-assigne">
                                    <div class="avatar-group-item">
                                      <a href="javascript: void(0);" class="d-inline-block" data-bs-toggle="tooltip"
                                        data-bs-placement="top" value="member-3" aria-label="Annmarie Paul"
                                        data-bs-original-title="Annmarie Paul">
                                        <img
                                          :src="apiUrl + JSON.parse((data?.order_detail)[0]?.product?.product_img)[0]"
                                          alt="" class=" rounded-circle
                                            avatar-sm" />
                                      </a>
                                    </div>
                                  </div>
                                  <!-- end avatar group -->
                                </div>

                                <div class="col-xl-2 col-md-6 detail-on">
                                  {{ formatCurrency(data.total_cost) }}
                                </div>
                                <div class="col-2 detail-off">
                                  {{ convertTime(data.created_at) }}
                                </div>
                                <!-- end col -->
                                <div class="col-3 detail-off">
                                  <div class="d-flex flex-wrap gap-3 mt-3 mt-xl-0 justify-content-md-end">
                                    <div>
                                      <span v-show="data.status == 'payment_failed'"
                                        class="badge rounded-pill text-danger font-size-11 task-status">Thanh toán
                                        thất bại</span>
                                      <span v-show="data.status == 'pending_payment'"
                                        class="badge rounded-pill text-warning font-size-11 task-status">Chờ thanh
                                        toán</span>
                                      <span v-show="data.status == 'preparing'"
                                        class="badge rounded-pill text-info font-size-11 task-status">Đang chuẩn
                                        bị</span>
                                      <span v-show="data.status == 'shipping'"
                                        class="badge rounded-pill orange font-size-11 task-status">Đang giao</span>
                                      <span v-show="data.status == 'delivered'"
                                        class="badge rounded-pill text-success font-size-11 task-status">Đã
                                        giao</span>
                                      <span v-show="data.status == 'cancelled'"
                                        class="badge rounded-pill red font-size-11 task-status">Đã hủy</span>
                                    </div>

                                    <div>
                                      <a href="#" class="mb-0 text-muted fw-medium" data-bs-toggle="modal"
                                        data-bs-target=".bs-example-new-task"><i
                                          class="mdi mdi-square-edit-outline font-size-16 align-middle"
                                          onclick="editTask('task-item-4')"></i></a>
                                    </div>
                                    <div>
                                      <a href="#" class="delete-item" onclick="deleteProjects('task-item-4')">
                                        <i class="mdi mdi-trash-can-outline font-size-16 align-middle text-danger"></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                <div class="col-xl-3 col-md-6 detail-on">
                                  <router-link :to="{
                                    name: 'order-detail',
                                    params: { id: data.order_id },
                                  }">Xem chi tiết</router-link>
                                </div>
                                <!-- end col -->
                              </div>
                              <!-- end row -->
                            </div>
                            <!-- end col -->
                          </div>
                          <!-- end row -->
                        </div>
                        <!-- end cardbody -->
                      </div>
                      <!-- end card -->
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="!orderStore.listOrder.length" class="text-center">
                Bạn chưa có đơn hàng nào!
              </div>
              <!-- </el-scrollbar> -->
            </div>
            <el-pagination v-model:current-page="currentOrderPage" @current-change="handleOrderCurrentChange" background
              layout="prev, pager, next" :total="Math.ceil(orderStore.listOrder.length / pageSize) * 10" class="mt-4"
              size="small" />
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="">
          <div class="">
            <div>
              <h4 class="mb-4 design-fontweight-600">Địa chỉ của bạn</h4>
              <div class="d-flex flex-column flex-md-row align-items-center justify-content-center">
                <div class="list-group">
                  <el-scrollbar v-show="listAddressUser != null" height="230px">
                    <a v-for="(data, index) in listAddressUser" class="list-group-item d-flex gap-3 py-3">
                      <i class="fa-solid fa-location-dot"></i>
                      <div class="d-flex gap-2 w-100 justify-content-between">
                        <div>
                          <h6 class="mb-0">Địa chỉ {{ index + 1 }}</h6>
                          <p class="mb-0 opacity-75">
                            {{ data.address }} {{ data.commue }}
                            {{ data.district }} {{ data.city }} -
                            {{ data.name }} - {{ data.phone }}
                          </p>
                        </div>
                        <small class="opacity-50 text-nowrap mt-4"><button class="border-none"
                            @click="handleDeteleAddress(index)">
                            <i class="fa-solid fa-trash"></i></button></small>
                      </div>
                      <hr />
                    </a>
                  </el-scrollbar>
                  <p v-show="listAddressUser == null">Bạn chưa thêm địa chỉ!</p>
                  <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                    <div class="d-flex w-100 justify-content-between" data-bs-toggle="modal"
                      data-bs-target="#addressModal">
                      <div>
                        <p class="mb-0 opacity-75">
                          <i class="fa-solid fa-plus border border-dark rounded-circle"></i>
                          Thêm địa chỉ mới.
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- end card body -->
        </div>
        <!-- end card -->

        <!-- Start Model -->
        <div class="modal fade" id="addressModal" tabindex="-1" aria-labelledby="addressModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 fw-bold" id="addressModalLabel">
                  Thêm địa chỉ mới
                </h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="table-responsive">
                  <table class="table table-bordered mb-0">
                    <tbody>
                      <tr>
                        <th scope="row">Họ và tên</th>
                        <td>
                          <input type="text" name="name" v-model="addressInfoData.name"
                            placeholder="Vui lòng nhập họ tên" />
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
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Đóng
                </button>
                <button @click="handleCreateAddress" type="button" class="btn"
                  style="background-color: #234A2B; color: white;">
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- End Model -->
        <hr />
        <div class="mt-1">
          <div>
            <h4 class="card-title mb-4 design-fontweight-600">Quản lý tài khoản</h4>
            <ul class="list-group hover">
              <li class="list-group-item list-group-item-action my-1 btn" @click="dialogListFavorite = true">
                <i class="fa-solid fa-heart"></i>
                Danh sách sản phẩm yêu thích
              </li>
              <li class="list-group-item list-group-item-action my-1 btn" @click="dialogUpdateProfile = true">
                <i class="fa-solid fa-pen-to-square"></i> Cập nhật thông tin tài
                khoản
              </li>
              <li class="list-group-item list-group-item-action my-1 btn" @click="dialogUpdatePassword = true"
                :class="Cookies.get('isGoogleLogin') == 'true' ? 'disabled-item' : ''">
                <i class="fa-solid fa-key"></i> Đổi mật khẩu
              </li>
              <li class="list-group-item list-group-item-action my-1 btn">
                <i class="fa-solid fa-trash"></i> Xóa tài khoản
              </li>
              <li v-show="affiliateStatus != 'approved' || !affiliateStatus"
                class="list-group-item list-group-item-action my-1 btn" @click="dialogAffiliateRegister = true">
                <i class="fa-solid fa-user-ninja"></i> Đăng ký tiếp thị
              </li>
              <li v-show="affiliateStatus == 'approved'" @click="redirectToAffiliate"
                class="list-group-item list-group-item-action my-1 btn">
                <i class="fa-solid fa-shop"></i> Shop tiếp thị liên kết
              </li>
            </ul>
            <!-- end ul -->
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->
    </div>
  </div>

  <!-- Content dialog -->
  <el-dialog v-model="dialogListFavorite" title="Danh sách yêu thích" width="800">
    <section class="intro">
      <div class="gradient-custom-1 h-100">
        <div class="mask d-flex align-items-center h-100">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-12">
                <div class="table-responsive bg-white">
                  <table class="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">STT</th>
                        <th scope="col">HÌNH ẢNH</th>
                        <th scope="col">TÊN SẢN PHẨM</th>
                        <th scope="col">GIÁ BÁN</th>
                        <th scope="col">Chi tiết</th>
                        <th scope="col">Trạng thái</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(data, index) in paginatedFavoriteList" :key="data.favorite_id">
                        <th scope="row" style="color: #666666">
                          {{ index + 1 }}
                        </th>
                        <td>
                          <img :src="apiUrl +
                            JSON.parse(data.product.product_img)[0]
                            " alt="" width="40px" />
                        </td>
                        <td>{{ data.product.product_name }}</td>
                        <td>
                          {{ formatCurrency(data.product.product_price) }}
                        </td>
                        <td>
                          <router-link :to="{
                            name: 'product-detail',
                            params: { id: data.product.product_id },
                          }">Xem chi tiết</router-link>
                        </td>
                        <td>
                          <div class="design-heart" @click="deleteFavorite(data.product.product_id)">
                            <i class="fa-solid fa-heart"></i>
                          </div>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                  <div class="text-center">
                    <span v-show="favoriteStore.length == 0" style="font-size: 20px;"> Không có sản phẩm nào</span>
                  </div>
                  <div class="text-end">
                    <el-pagination v-model:current-page="currentFavoritePage"
                      @current-change="handleFavoriteCurrentChange" small background layout="prev, pager, next"
                      :total="Math.ceil(favoriteStore.length / pageSize) * 10" class="mt-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </el-dialog>
  <el-dialog v-model="dialogUpdateProfile" title="Cập nhật thông tin tài khoản" width="800">
    <form @submit.prevent="handleUpdateUser" enctype="multipart/form-data">
      <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">HỌ VÀ TÊN</label>
        <div class="col-sm-10">
          <input v-model="nameUser" type="text" name="name" class="form-control" list="datalistOptions"
            id="exampleDataList" />
        </div>
        <span class="text-danger text-center">{{ nameUserError }}</span>
        <label for="staticEmail" class="col-sm-2 col-form-label">Hình ảnh</label>
        <div class="col-sm-10 mt-1">
          <input type="file" @change="handleImageUpload" name="image" />
        </div>
      </div>
      <div class="mb-3 row">
        <button type="submit" class="btn btn-success">
          Cập nhật
        </button>
      </div>
    </form>
  </el-dialog>


  <el-dialog v-model="dialogUpdatePassword" title="Đổi mật khẩu" width="800">
    <div class="mb-3 row">
      <label for="inputPassword" class="col-sm-2 col-form-label">MẬT KHẨU MỚI</label>
      <div class="col-sm-10">
        <input type="password" class="form-control" id="inputPassword" v-model="newPass" />
      </div>

      <span class="text-danger text-center">{{ newPassError }}</span>
    </div>

    <div class="mb-3 row">
      <label for="inputPassword" class="col-sm-2 col-form-label">MẬT KHẨU CŨ</label>
      <div class="col-sm-10">
        <input type="password" class="form-control" id="inputPassword" v-model="oldPass" />
      </div>

      <span class="text-danger text-center">{{ oldPassError }}</span>
    </div>

    <div class="mb-3 row">
      <span class="text-danger text-center">{{ passWordError }}</span>
      <button @click="handleUpdatePassword" type="button" class="btn btn-success">
        Cập nhật
      </button>
    </div>
  </el-dialog>

  <el-dialog v-model="dialogAffiliateRegister" title="ĐĂNG KÝ TIẾP THỊ" width="800">
    <div class="mb-3 row">
      <label for="name" class="col-sm-2 col-form-label">Họ và tên</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="name" v-model="affiliateData.name"
          :disabled="affiliateStatus == 'pending' || affiliateStatus == 'rejected'" />
      </div>
      <span class="text-danger text-center">{{ affiliateNameError }}</span>
    </div>

    <div class="mb-3 row">
      <label for="email" class="col-sm-2 col-form-label">Email</label>
      <div class="col-sm-10">
        <input type="email" class="form-control" id="email" v-model="affiliateData.email" disabled />
      </div>
      <!-- <span class="text-danger text-center">{{ emailError }}</span> -->
    </div>

    <div class="mb-3 row">
      <label for="social_media_link" class="col-sm-2 col-form-label">Link mạng xã hội</label>
      <div class="col-sm-10">
        <input v-model="affiliateData.social_media_link" type="text" class="form-control" id="social_media_link"
          placeholder="Link trang cá nhân facebook hoặc các mạng xã hội khác" maxlength="100"
          :disabled="affiliateStatus == 'pending' || affiliateStatus == 'rejected'" />
      </div>
    </div>
    <div class="mb-3 mt-0 row">
      <span class="col-sm-2"></span>
      <span class="col-sm-10 text-danger">{{ affiliateSocialMediaLinkError }}</span>
    </div>

    <div class="mb-3 row">
      <label for="phoneNumber" class="col-sm-2 col-form-label">Số điện thoại</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="phoneNumber" v-model="affiliateData.phone"
          :disabled="affiliateStatus == 'pending' || affiliateStatus == 'rejected'" />
      </div>

    </div>

    <div class="mb-3 mt-0 row">
      <span class="col-sm-2"></span>
      <span class="col-sm-10 text-danger">{{ affiliatePhoneNumberError }}</span>
    </div>

    <!-- Điều khoản -->
    <div class="mb-3">
      <el-card shadow="hover">
        <div class="terms-header">
          <h4>Điều khoản chương trình tiếp thị liên kết</h4>
        </div>
        <el-scrollbar style="max-height: 180px;">
          <p>1. Cung cấp thông tin chính xác khi đăng ký. Chúng tôi có quyền xét duyệt yêu cầu của bạn.</p>
          <p>2. Chia sẻ link tiếp thị đúng cách, không vi phạm pháp luật, và không gây ảnh hưởng xấu đến thương hiệu.
          </p>
          <p>3. Hoa hồng sẽ được thanh toán dựa trên đơn hàng hợp lệ từ link tiếp thị của bạn.</p>
          <p>4. Chúng tôi có quyền chấm dứt nếu bạn vi phạm quy định. Bạn có thể rút khỏi chương trình bất kỳ lúc nào.
          </p>
          <p>5. Chúng tôi có quyền cập nhật điều khoản. Tiếp tục tham gia đồng nghĩa với việc bạn đồng ý với thay đổi.
          </p>
        </el-scrollbar>
      </el-card>
    </div>

    <div class="mb-3">
      <div>
        <el-checkbox v-model="isAgree" :disabled="affiliateStatus == 'pending'">Tôi đồng ý với điều khoản</el-checkbox>
      </div>
    </div>

    <div class="mb-3 row">
      <button v-show="affiliateStatus == ''" type="button" class="btn btn-success" @click="submitRequest">
        Gửi yêu cầu xét duyệt
      </button>
      <button v-show="affiliateStatus == 'pending'" type="button" class="btn btn-danger" disabled>
        Yêu cầu của bạn đang được xử lý
      </button>
      <button v-show="affiliateStatus == 'rejected'" type="button" class="btn btn-danger" disabled>
        Yêu cầu của bạn đã bị từ chối
      </button>
    </div>
  </el-dialog>



</template>

<script setup>
import * as Yup from "yup";
import Cookies from 'js-cookie';
import userService from "@/services/user.service";
import { computed, onMounted, reactive, ref, watchEffect, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useFavoriteStore } from "../stores/favorite";
import { useOrderStore } from "../stores/order";
import { useNotificationStore } from "@/stores/notification";
import addressData from "@/assets/address/dvhc.json";
import { convertTime, formatCurrency } from '@/helpers/UtilHelper';
import { showSuccess, showWarning } from "../helpers/NotificationHelper";
import { showLoading } from "../helpers/LoadingHelper";
import affiliateService from "@/services/affiliate.service";
import favoriteService from "@/services/favorite.service";
import { useRouter } from "vue-router";
import { initializeEcho } from "../pusher/echoConfig";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const authStore = useAuthStore();

const userId = computed(() => authStore.user_id);
const favoriteStore = useFavoriteStore();
const orderStore = useOrderStore();
const notificationStore = useNotificationStore();
const userData = ref({});
const nameUser = ref("");
const imageUpdate = ref("");
const listAddressUser = ref([]);
const currentOrderPage = ref(1);
const currentFavoritePage = ref(1);
const pageSize = 5;
// Define some value for hanlde Update Password
const newPass = ref("");
const oldPass = ref("");
const passWordError = ref(null);
const echoInstance = initializeEcho();


echoInstance.channel(`user-channel.${userId.value}`)
  .listen('.order.update.status', async (event) => {
    orderStore.fetchListOrder();
    fetchUserData();
    notificationStore.getByUser();
  });

echoInstance.channel(`user-channel.${userId.value}`).listen('.affiliate-approved', async (event) => {
  hanleCheckStatusAffiliate();
});

echoInstance.channel(`order-updated.${userId.value}`)
  .listen('.order.status.updated.failed', async (event) => {
    orderStore.fetchListOrder();
  });


const router = useRouter();
// Dialog var
const dialogAffiliateRegister = ref(false);
const dialogListFavorite = ref(false);
const dialogUpdateProfile = ref(false);
const dialogUpdatePassword = ref(false);
// End

const redirectToAffiliate = () => {
  router.push({ name: "affiliate" });
}

// Schema validation Hanlde create Address
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

const affiliateNameError = ref(null);
const affiliateSocialMediaLinkError = ref(null);
const affiliatePhoneNumberError = ref(null);
const isAgree = ref(false);
const affiliateStatus = ref("");

const affiliateSchema = Yup.object().shape({
  name: Yup.string().required("Họ và tên không được để trống"),
  phone: Yup.string()
    .matches(/^\d+$/, "Số điện thoại chỉ được chứa số")
    .min(10, "Số điện thoại phải 10 ký tự")
    .max(10, "Số điện thoại phải 10 ký tự")
    .required("Số điện không được để trống"),
  social_media_link: Yup.string().required("Link mạng xã hội không được để trống"),

});

const submitRequest = () => {
  if (!isAgree.value) {
    showWarning("Vui lòng đồng ý với điều khoản")
  } else {
    affiliateSchema.validate(affiliateData.value, { abortEarly: false }).then(async () => {
      const userUpdateResponse = await userService.updateNameAndPhone(affiliateData.value);
      if (userUpdateResponse.status == "success") {
        const response = await affiliateService.create({
          social_media_link: affiliateData.value.social_media_link
        });

        if (response.status == "success") {
          showSuccess("Yêu cầu của bạn đã được gửi đi");
          hanleCheckStatusAffiliate();
          dialogAffiliateRegister.value = false;
        }
      }
    }).catch((errors) => {
      errors.inner.forEach((error) => {
        if (error.path == "name") {
          affiliateNameError.value = error.message;
        }
        if (error.path == "phone") {
          affiliatePhoneNumberError.value = error.message;
        }
        if (error.path == "social_media_link") {
          affiliateSocialMediaLinkError.value = error.message;
        }
      })
    });
  }
}

const hanleCheckStatusAffiliate = async () => {
  try {
    const response = await affiliateService.checkStatus();
    affiliateStatus.value = response.data;
    console.log("Affiliate Status: ", response);
  } catch (error) {
    console.log(error.response);
  }
}


// End define

// Address Data
const addressInfoData = reactive({
  name: "",
  phone: "",
  city: "",
  district: "",
  commue: "",
  address: "",
});

const affiliateData = ref({
  name: "",
  email: "",
  phone: "",
  social_media_link: "",
});

const cityAddress = ref(0);
const districtAddress = ref(0);
const commueAddress = ref(0);
const listDistrict = ref([]);
const listCommune = ref([]);

const fetchUserData = async () => {
  try {
    const userId = authStore.user_id;

    const response = await userService.get(userId);
    userData.value = response.data;
    affiliateData.value.name = response.data.name;
    affiliateData.value.email = response.data.email;
    affiliateData.value.phone = response.data.phone || "";
    nameUser.value = response.data.name;
    console.log(response.data.address);
    listAddressUser.value = JSON.parse(response.data.address);
  } catch (error) {
    console.log(error.response);
  }
};



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

const deleteFavorite = async (productId) => {
  try {
    const response = await favoriteService.delete(productId);
    await favoriteStore.fetchListFavorite();
    showSuccess("Đã loại bỏ khỏi danh sách yêu thích");
  } catch (error) {
    console.log(error.response);
  }
};

const updateNameUser = async (data) => {
  try {
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }
    const response = await userService.update(data);
    console.log(response);
  } catch (error) {
    console.log(error.response);
  }
};



const nameUserError = ref("");
const handleUpdateUser = async () => {
  if (!nameUser.value.trim()) { // Ensure no empty or whitespace values
    nameUserError.value = "Họ và tên không được để trống";
    return;
  }

  const dataUpdate = new FormData();
  dataUpdate.append("name", nameUser.value.trim()); // Trim spaces before appending
  if (imageUpdate.value) {
    dataUpdate.append("image", imageUpdate.value);
  }

  try {
    await updateNameUser(dataUpdate);
    const loading = showLoading();
    setTimeout(() => {
      showSuccess("Cập nhật thành công");
      fetchUserData();
      loading.close();
      dialogUpdateProfile.value = false;
    }, 2000);
  } catch (error) {
    console.log(error.response);
  }
};

const schemaPass = Yup.object().shape({
  oldPass: Yup.string()
    .matches(/[a-zA-Z]/, "Mật khẩu phải có ít nhất một chữ cái")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(20, "Mật khẩu chỉ tối đa 20 ký tự")
    .required("Mật khẩu không được để trống"),
  newPass: Yup.string()
    .matches(/[a-zA-Z]/, "Mật khẩu phải có ít nhất một chữ cái")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(20, "Mật khẩu chỉ tối đa 20 ký tự")
    .required("Mật khẩu không được để trống"),
});

const newPassError = ref(null);
const oldPassError = ref(null);

const updatePassWord = async () => {
  try {
    const response = await userService.updatePass({
      new_pass: newPass.value,
      old_pass: oldPass.value,
    });
    const loading = showLoading();
    setTimeout(() => {
      showSuccess("Cập nhật mật khẩu thành công");

      loading.close();
      dialogUpdatePassword.value = false;
    }, 2000);
  } catch (error) {
    console.log(error.response);
    if (error.response.data.error === "Password is incorrect") {
      passWordError.value = "Mật khẩu cũ không đúng";
    }
  }
};

const handleUpdatePassword = async () => {
  newPassError.value = null;
  oldPassError.value = null;
  passWordError.value = null;
  schemaPass
    .validate(
      { oldPass: oldPass.value, newPass: newPass.value },
      { abortEarly: false }
    )
    .then(() => {
      newPassError.value = null;
      oldPassError.value = null;

      updatePassWord();
    })
    .catch((errors) => {
      errors.inner.forEach((error) => {
        if (error.path == "newPass") {
          newPassError.value = error.message;
        }
        if ((error.path = "oldPass")) {
          oldPassError.value = error.message;
        }
      });
    });
  // console.log("New Pass: ", newPass.value);
  // console.log("Old Pass: ", oldPass.value);
};

// Handle create address
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
          showSuccess("Thêm địa chỉ thành công.");
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

// Hanlde delete address

const handleDeteleAddress = async (index) => {
  try {
    const response = await userService.deleteAddress(index).then(() => {
      showSuccess("Xóa địa chỉ thành công.");
      fetchUserData();

    })
    // console.log("Delete: ", response);
  } catch (error) {
    console.log(error.response);
  }
};

const handleFetchCartCount = async () => {
  try {
    await cartStore.fetchCartCount();
  } catch (error) {
    console.log(error.response);
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageUpdate.value = file;
    console.log(file);
  }
};


onMounted(async () => {
  hanleCheckStatusAffiliate();
  handleFetchCartCount();
  fetchUserData();
  await favoriteStore.fetchListFavorite();
  await orderStore.fetchListOrder();
  Cookies.remove("recentOrderBillId");

  // console.log("GET: ", getDataDistric("01")[0].name);
});

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

const handleFavoriteCurrentChange = (val) => {
  currentFavoritePage.value = val;
  console.log(`current page: ${val}`);
};

const handleOrderCurrentChange = (val) => {
  currentOrderPage.value = val;
}

const paginatedFavoriteList = computed(() => {
  const startIndex = (currentFavoritePage.value - 1) * pageSize;
  return favoriteStore.listFavorite.slice(startIndex, startIndex + pageSize);
});

const paginatedOrderList = computed(() => {
  const startIndex = (currentOrderPage.value - 1) * pageSize;
  return orderStore.listOrder.slice(startIndex, startIndex + pageSize);
})

watch(affiliateData.value, (newVal) => {
  if (newVal) {
    affiliatePhoneNumberError.value = '';
    affiliateNameError.value = '';
  }
})
</script>

<style scoped>
:deep(.el-pagination .el-pager .is-active) {
  background-color: black !important;
}

.disabled-item {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}


.design-fontweight-600 {

  font-weight: 600;
}

@media (max-width: 739px) {
  .detail-off {
    display: none;
    /* Ẩn cột có lớp col-4 */
  }

  detail-on {
    width: 150%;
  }
}

.yellow {
  color: yellow;
}

.primary-orange {
  color: #ffe599;
}

.orange {
  color: #ffa500;
}

.red {
  color: #c81f30;
}

.border-none {
  border: none;
}

.border-none:hover {
  color: #038edc;
}

.hover li {
  background-color: #ccc;
}

.hover li:hover {
  background-color: #234A2B;
  color: white;
}

.avatar-xxl {
  height: 7rem;
  width: 7rem;
}

.card {
  margin-bottom: 20px;
  -webkit-box-shadow: 0 2px 3px #eaedf2;
  box-shadow: 0 2px 3px #eaedf2;
}

.pb-0 {
  padding-bottom: 0 !important;
}

.font-size-16 {
  font-size: 16px !important;
}

.avatar-title {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #038edc;
  color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-weight: 500;
  height: 100%;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%;
}

.bg-soft-primary {
  background-color: rgba(3, 142, 220, 0.15) !important;
}

.rounded-circle {
  border-radius: 50% !important;
}

.nav-tabs-custom .nav-item .nav-link.active {
  color: #038edc;
}

.nav-tabs-custom .nav-item .nav-link {
  border: none;
}

.nav-tabs-custom .nav-item .nav-link.active {
  color: #038edc;
}

.avatar-group {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding-left: 12px;
}

.border-end {
  border-right: 1px solid #eff0f2 !important;
}

.d-inline-block {
  display: inline-block !important;
}

.avatar-group .avatar-group-item {
  margin-left: -14px;
  border: 2px solid #fff;
  border-radius: 50%;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}

.avatar-sm {
  height: 2rem;
  width: 2rem;
}

.nav-tabs-custom .nav-item {
  position: relative;
  color: #343a40;
}

.nav-tabs-custom .nav-item .nav-link.active:after {
  -webkit-transform: scale(1);
  transform: scale(1);
}

.nav-tabs-custom .nav-item .nav-link::after {
  content: "";
  /* background: #038edc; */
  height: 2px;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: -2px;
  -webkit-transition: all 250ms ease 0s;
  transition: all 250ms ease 0s;
  -webkit-transform: scale(0);
  transform: scale(0);
}

/* My design */
.contain-list-order {
  border-style: groove;
  margin-bottom: 4px;
}

.contain-list-order-child {
  padding: 8px;
}

.order-item {
  border-style: ridge;
}

/* Customize Favorite Hanle */
.design-heart {
  margin-left: 24px;
  color: red;
}
</style>
