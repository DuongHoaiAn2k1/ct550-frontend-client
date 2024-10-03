<template>
    <footer class="background-footer text-center text-lg-start">
        <div class="top-strip"></div>
        <!-- Grid container -->
        <div class="container p-4">
            <div class="row mb-3 py-2">
                <div class="col text-content">
                    Giao hàng và thu tiền tận nơi toàn quốc Hỗ trợ 24/7: 0943 808 107
                </div>
                <div class="col text-content">
                    Tìm chúng tôi &nbsp;
                    <a href="https://www.facebook.com/profile.php?id=100031101393923"><i
                            class="fa-brands fa-facebook"></i></a>
                    &nbsp;
                    <a href="https://www.instagram.com/an.assembly.12/"><i class="fa-brands fa-instagram"></i></a>
                    &nbsp;
                    <a><i class="fa-brands fa-telegram"></i></a>
                    &nbsp;
                    <a><i class="fa-brands fa-twitter"></i></a>
                </div>
            </div>
            <!--Grid row-->
            <div class="row">
                <hr />

                <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                    <h5 class="text-uppercase mb-2 text-content">Liên hệ</h5>
                    <ul>
                        <li class="address text-content">
                            94 3/2 Xuân Khánh, Ninh Kiều, Cần THơ <br />(Địa chỉ cũ ấp 10 xã
                            Khánh Tiến Huyện U Minh Tỉnh Cà Mau)
                        </li>
                        <li class="tel text-content"><a href="tel:0943 808 107">0943 808 107</a></li>
                        <li class="phone text-content"><a href="tel:0976 146 523">0976 146 523</a></li>
                        <li class="time text-content">Thứ 2-6: 8h - 20h; Thứ 7-CN: 9h - 17h</li>
                    </ul>
                </div>

                <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                    <h5 class="text-uppercase mb-2 text-content">Hỗ trợ</h5>

                    <ul>
                        <li class="nav-item me-2 me-lg-0 d-none d-md-inline-block">
                            <router-link class="nav-link text-content" :to="{ name: 'shipping' }"> Chính sách giao
                                hàng</router-link>
                        </li>
                        <li class="nav-item me-2 me-lg-0">
                            <router-link class="nav-link text-content" :to="{ name: 'guide' }"> Hướng dẫn mua
                                hàng</router-link>
                        </li>
                        <li class="nav-item me-2 me-lg-0">
                            <router-link class="nav-link text-content" :to="{ name: 'contact' }">Thông tin liên
                                hệ</router-link>
                        </li>
                    </ul>
                </div>

                <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                    <h5 class="text-uppercase mb-2 text-content">Danh mục</h5>

                    <ul class="text-content">
                        <li><a>Khô cá Cà Mau</a></li>
                        <li><a>Tôm khô Cà Mau</a></li>
                        <li><a>Bánh phồng tôm</a></li>
                        <li><a>Khô 1 nắng</a></li>
                        <li><a>Mực khô Cà Mau</a></li>
                    </ul>
                </div>

                <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                    <h5 class="text-uppercase mb-2 text-content">Đối tác</h5>

                    <ul>
                        <li>
                            <a href="https://dacsan4u.com" target="_blank">Đặc sản 4K</a>
                        </li>
                        <li>
                            <a href="https://tomkhocamau.net" target="_blank">Tôm khô Cà Mau</a>
                        </li>
                        <li>
                            <a href="https://banhphongtom.net" target="_blank">Bánh phồng tôm miền Tây</a>
                        </li>
                    </ul>
                </div>
            </div>
            <!--Grid row-->
        </div>
        <!-- Grid container -->

        <!-- Copyright -->
        <div class="text-center p-3 text-content" style="background-color: rgba(0, 0, 0, 0.05)">
            © 2024 B2014552 - Dương Hoài Ân
        </div>
        <div class="chat-container">
            <!-- Button để hiển thị Chatbox -->
            <button class="chatbox" @click="toggleChat">
                <i class="fa-solid fa-comment"></i>
                <span v-show="countUnRead != 0" class="badge rounded-pill badge-notification bg-danger design-count">{{
                    countUnRead
                    }}</span>
            </button>

            <!-- Chatbox component -->
            <div class="chatbox-container" v-show="isChatVisible">
                <Chat @toggleChat="toggleChat" :is-chat-visible="isChatVisible" @value-changed="countUnReadfuction" />
            </div>
        </div>


        <!-- Copyright -->
        <button class="go-top-btn" @click="goToTop">
            <i class="fa-solid fa-arrow-up"></i>
        </button>
    </footer>
</template>

<script setup>
import { ref } from "vue";
import Chat from "../../components/Chat/ChatBox.vue";

const isChatVisible = ref(false);
const countUnRead = ref(0);

const toggleChat = () => {
    isChatVisible.value = !isChatVisible.value;
};
const goToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

const countUnReadfuction = (newValue) => {
    countUnRead.value = newValue;
}
</script>

<style scoped>
.design-count {
    font-size: 8px;
    position: absolute;
}

.chat-container {
    position: relative;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: flex-end;
}

.chatbox {
    position: fixed;
    bottom: 80px;
    right: 20px;
    background-color: #234A2B;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 999;
    border: 2px solid white;
}

.chatbox-container {
    position: absolute
}

@media only screen and (max-width: 767px) {}

.go-top-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #234A2B;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 999;
    border: 2px solid white;

}

.background-footer {
    background-color: #234A2B !important;
}

ul {
    padding: 0px;
}

ul li {
    list-style: none;
}

.text-content {
    color: white;
}

a {
    text-decoration: none;
    color: white;
}

.top-strip {
    background-color: #182b1c;
    height: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style>