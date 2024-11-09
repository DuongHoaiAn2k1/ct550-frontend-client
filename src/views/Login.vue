<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-10 col-xl-9 mx-auto">
        <div class="card flex-row my-2 border-0 shadow rounded-3 overflow-hidden">
          <div class="card-img-left d-none d-md-flex">
            <!-- Background image for card set in CSS! -->
          </div>
          <div class="card-body p-4 p-sm-5">
            <h2 class="card-title text-center mb-5" style="color: #234A2B; font-weight: 600;">Đăng nhập</h2>
            <form @submit="submitLogin">
              <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floatingInputEmail" placeholder="name@example.com"
                  v-model="dataLogin.email" name="email" />
                <label for="floatingInputEmail">Email</label>
                <span class="text-danger">{{ emailErrors }}</span>
              </div>

              <div class="form-floating mb-3">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                  v-model="dataLogin.password" name="password" />
                <label for="floatingPassword">Mật khẩu</label>
                <span class="text-danger">{{ passwordErrors }}</span>
              </div>
              <div class="d-grid mb-2">
                <button class="btn btn-lg btn-login fw-bold text-uppercase" type="submit"
                  style="background-color: #234A2B; color: white;">
                  Đăng nhập
                </button>
              </div>

              <div class="text-center">
                <a @click="isShowForgetForm = !isShowForgetForm" class="mt-2 small  me-3" href="#">Quên mật khẩu?</a>
                <router-link :to="{ name: 'register' }" class="mt-2 small" href="#">Đăng ký</router-link>
              </div>

              <hr class="my-4" />

              <div class="d-grid mb-2">
                <button class="btn btn-lg btn-google btn-login fw-bold text-uppercase" @click.prevent="loginWithGoogle">
                  <i class="fab fa-google me-2"></i> Đăng nhập với Google
                </button>
              </div>

              <!-- <div class="d-grid">
                <button class="btn btn-lg btn-facebook btn-login fw-bold text-uppercase" @click="notificationLogin">
                  <i class="fab fa-facebook-f me-2"></i> Đăng nhập với Facebook
                </button>
              </div> -->
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="isShowForgetForm" width="500" center>
    <div class="card text-center form-reset-password" style="width: 450px;">
      <div class="card-header h5 text-white bg-dark">Cấp lại mật khẩu</div>
      <div class="card-body px-5">
        <p class="card-text py-2">
          Điền email tài khoản của bạn để đặt lại mật khẩu. Mật khẩu mới sẽ được gửi vào email của bạn. Bạn chỉ có thể
          cập
          nhật mật khẩu 1 lần/tháng.
        </p>
        <div data-mdb-input-init class="form-outline">
          <input v-model="emailReset" type="email" id="typeEmail" class="form-control" />
          <span class="d-block text-danger">{{ emailResetError }}</span>
          <label class="form-label" for="typeEmail">Email</label>
        </div>
        <a href="#" @click="handleResetPassword" data-mdb-ripple-init class="btn btn-dark w-100">Cấp lại mật khẩu</a>
      </div>
    </div>
  </el-dialog>


</template>

<script setup>
import * as Yup from "yup";
import Cookies from "js-cookie";
import { ref, reactive, onMounted } from "vue";
import { ElLoading, ElNotification } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { useProductStore } from "@/stores/product";
import authService from "@/services/auth.service";
import userService from "@/services/user.service";
import { useRouter } from "vue-router";
import { h } from "vue";
import { showSuccess, showSuccessMessage, showWarning } from "@/helpers/NotificationHelper";
import { watch } from "vue";
const domain = import.meta.env.VITE_APP_DOMAIN_NAME;
const emailReset = ref("");
const emailResetError = ref(null);
const isShowForgetForm = ref(false);
const authStore = useAuthStore();
const productStore = useProductStore();
const router = useRouter();
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Email phải đúng định dạng")
    .required("Email không được để trống"),
  password: Yup.string()
    .matches(/[a-zA-Z]/, "Mật khẩu phải có ít nhất một chữ cái")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(20, "Mật khẩu chỉ tối đa 20 ký tự")
    .required("Mật khẩu không được để trống"),
});

const emailErrors = ref(null);
const passwordErrors = ref(null);

const dataLogin = reactive({
  email: "",
  password: "",
});

const submitLogin = async (event) => {
  event.preventDefault();

  emailErrors.value = null;
  passwordErrors.value = null;
  schema
    .validate(dataLogin, { abortEarly: false })
    .then(() => {
      emailErrors.value = null;
      passwordErrors.value = null;

      const loading = ElLoading.service({
        lock: true,
        text: "Đang xử lý...",
        background: "rgba(0,0,0, 0.7)",
      });

      console.log(dataLogin);
      const login = async (dataLogin) => {
        try {
          const response = await authService.login(dataLogin);
          console.log(response);
          const access_token = response.access_token;
          const refresh_token = response.refresh_token;
          const email = response.email;
          const user_id = response.user_id;
          const role = response.role;
          const affiliate_role = response.affiliate_role;
          if (affiliate_role != null) {
            Cookies.set("isAffiliateLogin", affiliate_role, { expires: 7 });
          }
          authStore.login(access_token, refresh_token, email, user_id, role);
          // Cookies.set("token", token, { expires: 1 });
          localStorage.setItem("requireLogin", false);
          showSuccessMessage("Đăng nhập thành công");
          setTimeout(() => {
            router.push({ name: "home" });
          }, 1000);
        } catch (error) {
          console.log(error.response);
          if (error.response.data.error === "Email or Password is incorrect") {
            showWarning("Email hoặc mật không chính xác");
          }
        }
      };

      setTimeout(() => {
        login(dataLogin);
        //
        loading.close();
      }, 2000);
    })
    .catch((errors) => {
      errors.inner.forEach((error) => {
        if (error.path == "email") {
          emailErrors.value = error.message;
        }

        if (error.path == "password") {
          passwordErrors.value = error.message;
        }
      });
    });
};

const resetPassword = async () => {
  try {
    if (!emailReset.value) {
      emailResetError.value = 'Email không được để trống';
      throw new Error('Validation error'); // Thêm throw ở đây để chặn tiếp tục thực hiện nếu validation thất bại
    }

    const response = await userService.resetPassword({
      email: emailReset.value
    });

    return response;

  } catch (error) {
    console.log(error.response);
    showWarning(error.response.data.message);
    throw error;
  }
};

const handleResetPassword = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Đang xử lý...",
    background: "rgba(0,0,0, 0.7)",
  });

  resetPassword()
    .then(() => {
      setTimeout(() => {
        showSuccess('Yêu cầu đã được gửi');
        loading.close();
      }, 1500);
    })
    .catch((error) => {
      loading.close();
    });
};


const loginWithGoogle = () => {
  const googleLoginUrl = domain + '/api/auth/google';
  const newWindow = window.open(googleLoginUrl, '_blank', 'width=500,height=600');

  window.addEventListener('message', (event) => {
    if (event.origin === domain) {
      const { access_token, refresh_token, user_id, email, role, google_id, affiliate_role } = event.data;
      newWindow.close();
      if (google_id != null) {
        Cookies.set("isGoogleLogin", true, { expires: 7 });
      }

      if (affiliate_role != null) {
        Cookies.set("isAffiliateLogin", affiliate_role, { expires: 7 });
      }
      authStore.login(access_token, refresh_token, email, user_id, role);
      localStorage.setItem("requireLogin", false);
      setTimeout(() => {
        showSuccessMessage("Đăng nhập thành công");
        router.push({ name: 'home' });
      }, 1000);
    }
  });

  const interval = setInterval(() => {
    if (newWindow.closed) {
      clearInterval(interval);
      const access_token = Cookies.get("accessTokenUser");
      const refresh_token = Cookies.get("refreshTokenUser");
      const user_id = Cookies.get("user_id");

      if (!access_token || !refresh_token || !user_id) {
        showWarning("Email hoặc mật khẩu không chính xác");
      }
    }
  }, 1000);
};

onMounted(() => {
  console.log("List Product from Pinia Store: ", productStore.listProduct);
  if (localStorage.getItem('requireLogin') == 'true') {
    showWarning("Vui lòng đăng nhập")
  }
});

watch(dataLogin, (newValue) => {
  if (newValue) {
    emailErrors.value = null;
    passwordErrors.value = null;
  }
});
</script>

<style scoped>
.form-reset-password {}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }

}

.card-img-left {
  width: 45%;
  /* Link to your background image using in the property below! */
  background: scroll center
    /* url("https://source.unsplash.com/WEQbe2jBg40/414x512"); */
    url("../assets/camau.jpg");
  background-size: cover;
}

.btn-login {
  font-size: 0.9rem;
  letter-spacing: 0.05rem;
  padding: 0.75rem 1rem;
}

.btn-google {
  color: white !important;
  background-color: #ea4335;
}

.btn-facebook {
  color: white !important;
  background-color: #3b5998;
}
</style>