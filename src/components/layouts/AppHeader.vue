<template>
    <section class="ftco-section">
        <nav class="navbar navbar-expand-lg navbar-color-custom bg-dark">
            <div class="container-fluid">
                <div class="col-md-1">
                    <router-link :to="{ name: 'home' }" class="ms-md-2">
                        <img class="logo" src="../../assets/logo.jpg" />
                    </router-link>
                </div>
                <div class="col-md-6">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ftco-nav"
                        aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="fa fa-bars"></span> Menu
                    </button>
                    <div class="collapse navbar-collapse" id="ftco-nav">
                        <ul class="navbar-nav m-auto">
                            <li class="nav-item active"><router-link :to="{ name: 'home' }"
                                    class="nav-link text-content">Trang chủ</router-link></li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle text-content" href="#" id="dropdown04"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Đặc sản</a>
                                <div class="dropdown-menu design-dropdown" aria-labelledby="dropdown04">
                                    <router-link :to="{ name: 'product', params: { id: category.category_id } }"
                                        class="dropdown-item" v-for="category in categoryStore.listCategory"
                                        :key="category.category_id">{{
                                            category.category_name }}</router-link>
                                </div>
                            </li>
                            <li class="nav-item text-content"><router-link :to="{ name: 'food' }" class="nav-link">Ẩm
                                    thực</router-link></li>
                            <li class="nav-item text-content"><router-link :to="{ name: 'guide' }"
                                    class="nav-link">Hướng dẫn mua hàng</router-link></li>
                            <li class="nav-item text-content"><router-link :to="{ name: 'shipping' }"
                                    class="nav-link">Chính sách</router-link></li>
                            <li class="nav-item text-content"><router-link :to="{ name: 'contact' }"
                                    class="nav-link">Liên hệ</router-link></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-3">
                    <form action="#" class="searchform order-lg-last">
                        <div class="form-group d-flex">
                            <input type="text" class="form-control pl-3" placeholder="Search">
                            <button type="submit" placeholder="" class="form-control search">
                                <span class="fa fa-search"></span>
                            </button>
                        </div>
                    </form>
                </div>

                <div class="col-md-2">

                    <div class="d-flex">
                        <!-- Cart -->
                        <router-link :to="{ name: 'cart' }" class="text-reset me-4" href="#">
                            <span><i class="fas fa-shopping-cart cart-design"></i></span>
                            <span class="badge rounded-pill badge-notification bg-danger sub-cart-design">{{ number
                                }}</span>
                        </router-link>

                        <div class="me-4">
                            <a id="navbarUserDropdown" @click="showNotificationBox"><i class="fa-solid fa-bell"></i></a>
                            <div v-if="isNotiticationBox" class="notification-container">
                                <Notification />
                            </div>
                        </div>

                        <!-- Notification -->
                        <div class="dropdown">
                            <i class="fas fa-user dropdown-toggle user-design" data-bs-toggle="dropdown"
                                aria-expanded="false"></i>
                            <ul class="dropdown-menu">
                                <li v-show="!authStore.isUserLoggedIn">
                                    <router-link :to="{ name: 'login' }" class="dropdown-item">Đăng
                                        nhập</router-link>
                                </li>
                                <li v-show="!authStore.isUserLoggedIn">
                                    <router-link :to="{ name: 'register' }" class="dropdown-item">Đăng
                                        ký</router-link>
                                </li>
                                <li v-show="authStore.isUserLoggedIn">
                                    <router-link :to="{ name: 'profile' }" class="dropdown-item">Tài
                                        khoản</router-link>
                                </li>
                                <li v-show="authStore.isUserLoggedIn" @click="handleLogOut">
                                    <button class="dropdown-item">Đăng xuất</button>
                                </li>
                            </ul>
                        </div>
                        <!-- User -->
                    </div>
                </div>
            </div>
        </nav>
    </section>
    <div class="custom-bar">
        <div class="top-strip"></div>
        <div class="middle-strip"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Notification from '../Notifications/Notification.vue';
import { useCategoryStore } from '../../stores/category';
import { useAuthStore } from "../../stores/auth";
import { useCartStore } from '../../stores/cart';
import { showSuccessMessage } from "../../helpers/NotificationHelper";
import { useRouter } from "vue-router";
const router = useRouter();

const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const isNotiticationBox = ref(false);
const showNotificationBox = () => {
    isNotiticationBox.value = !isNotiticationBox.value;
}

const number = computed(() => {
    return cartStore.count;
})

const handleLogOut = () => {
    authStore.logout();
    showSuccessMessage("Đăng xuất thành công");
}

onMounted(async () => {

    await categoryStore.fetchListCategory();

    if (localStorage.getItem("processRefreshToken") == "true") {
        router.push({ name: "token" });
    }

});

// watch(cartStore.count, () => {
//     number.value = cartStore.count;
// });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
@import '../../assets/css/layouts/AppHeader.css';

.navbar-color-custom {
    background-color: #efdcb4 !important;
}

.logo {
    width: 80px;
    height: 80px;
    object-fit: contain;
}

.text-content {
    font-family: 'ui-monospace' !important;
    font-weight: 600;
}

.bg-darker .text-content {
    background-color: #efdbc4;
    padding: 10px;
    border-radius: 5px;
}

.notification-container {
    position: absolute;
    top: 40px;
    right: 10px;
    width: 300px;
    z-index: 1000;
}

.custom-bar {
    width: 100%;
}

.top-strip {
    background-color: #182b1c;
    height: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.middle-strip {
    background-color: #234A2B;
    height: 50px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    position: relative;
}

.design-dropdown .dropdown-item {
    color: #234A2B;
}

.design-dropdown .dropdown-item:hover {
    background-color: #234A2B;
    color: white;
}
</style>
