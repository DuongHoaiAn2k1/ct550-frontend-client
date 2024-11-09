<template>
    <section class="chatbox-form">
        <div class="container py-5" style="width: 74%; height: 68%;">

            <div class=" row ">
                <div class=" col-md-8 col-lg-6 col-xl-4">
                    <div class="card" id="chat1" style="border-radius: 15px;">
                        <div class="card-header d-flex justify-content-between align-items-center p-3 text-white border-bottom-0"
                            style="border-top-left-radius: 15px; border-top-right-radius: 15px; background-color: #234a2b;">
                            <p class="mb-0 fw-bold">Hỗ trợ</p>
                            <i @click="closeChat" class="fas fa-times"></i>
                        </div>


                        <div class="card-body">
                            <div v-show="messages.length == 0" class="text-center mb-5 card-notification">
                                <p>Hãy gửi tin nhắn để được hỗ trợ</p>
                            </div>
                            <div v-for="message in messages" :key="message.message_id" class="mb-4">

                                <!-- Nếu là tin nhắn của nhân viên -->
                                <div v-if="message.sender_id != authStore.user_id"
                                    class="d-flex flex-column align-items-start">
                                    <div class="d-flex flex-row align-items-start">
                                        <img src="../../../public/assets/images/admin/admin-img.png" alt="avatar 1"
                                            style="width: 45px; height: 100%;">
                                        <div class="p-3 ms-3"
                                            style="border-radius: 15px; background-color: rgba(57, 192, 237, .2);">
                                            <p class="small mb-0">{{ message.message }}</p>
                                        </div>
                                    </div>

                                    <!-- Hiển thị danh sách sản phẩm nếu tồn tại -->
                                    <div v-if="message.products && JSON.parse(message.products).length"
                                        class="product-list mt-2">
                                        <div class="d-flex flex-wrap">
                                            <div v-for="product in JSON.parse(message.products)"
                                                :key="product.product_id" class="product-container me-2 mb-2">
                                                <router-link class="text-decoration-none"
                                                    :to="{ name: 'product-detail', params: { id: product.product_id } }">
                                                    <img :src="apiUrl + product.product_img" class="product-image"
                                                        alt="product image">
                                                    <div class="product-info">
                                                        <h6 class="product-name">{{ product.product_name }}</h6>
                                                        <p class="product-price">{{
                                                            formatCurrency(product.product_price) }}
                                                        </p>
                                                    </div>
                                                </router-link>

                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <!-- Nếu là tin nhắn của khách hàng -->
                                <div v-if="message.sender_id == authStore.user_id"
                                    class="d-flex flex-column align-items-end">
                                    <div class="d-flex flex-row align-items-end">
                                        <div class="p-3 me-3 border bg-body-tertiary" style="border-radius: 15px;">
                                            <p class="small mb-0">{{ message.message }}</p>
                                        </div>
                                        <img :src="message.sender.avatar ? message.sender.avatar : message.sender.image ? apiUrl + message.sender.image : 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp'"
                                            alt="avatar 1" style="width: 45px; height: 100%;">
                                    </div>

                                    <!-- Hiển thị danh sách sản phẩm nếu tồn tại -->
                                    <div v-if="message.products && JSON.parse(message.products).length"
                                        class="product-list mt-2">
                                        <div class="d-flex flex-wrap">
                                            <div v-for="product in JSON.parse(message.products)"
                                                :key="product.product_id" class="product-item me-2 mb-2">
                                                <img :src="apiUrl + product.product_img" class="product-img-top"
                                                    alt="product image">
                                                <div class="product-body">
                                                    <h6 class="product-title">{{ product.product_name }}</h6>
                                                    <p class="product-price">{{ formatCurrency(product.product_price) }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div class="d-flex">
                            <input v-model="messageSend" type="text" class="form-control" placeholder="Nhập nội dung..."
                                @keyup.enter="handleCreateMessage"><button @click="handleCreateMessage"
                                class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </section>
</template>


<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { initializeEcho } from "../../pusher/echoConfig";
import messageService from "@/services/message.service";
import { avatarProps } from "element-plus";
import { formatCurrency } from "../../helpers/UtilHelper";
const messages = ref([]);
const authStore = useAuthStore();
const echoInstance = initializeEcho();
const messageSend = ref("");
const userId = computed(() => authStore.user_id);
const countUnRead = ref(0);
const props = defineProps({
    isChatVisible: Boolean,
});
const apiUrl = import.meta.env.VITE_APP_API_URL;

const emit = defineEmits(['toggleChat']);


echoInstance.channel(`chat.${userId.value}`).listen('.message.sent', async (event) => {
    // const response = await notificationStore.getAll();
    if (props.isChatVisible) {
        handleFetchMessageUser();
    }
    handleCountUnRead().then(() => {
        emit('value-changed', countUnRead.value);
    });
});

const handleCountUnRead = async () => {
    try {
        const response = await messageService.countUnRead();
        countUnRead.value = response.count;
        console.log("Message count: ", response);
    } catch (error) {
        console.log(error);
    }
}
const handleCreateMessage = async () => {
    try {
        const response = await messageService.create({
            message: messageSend.value,
            sender_id: authStore.user_id
        });
        messageSend.value = "";
        handleFetchMessageUser();
        handleCountUnRead().then(() => {
            emit('value-changed', countUnRead.value);
        });
    } catch (error) {
        console.log(error);
    }
}
const handleFetchMessageUser = async () => {
    try {
        const response = await messageService.get();
        messages.value = response.data;
        console.log("Message: ", response);
        handleCountUnRead().then(() => {
            emit('value-changed', countUnRead.value);
        });
    } catch (error) {
        console.log(error.response);
    }
}


const closeChat = () => {
    emit('toggleChat');
    props.isChatVisible = false;
}

watch(
    () => props.isChatVisible,
    (newValue) => {
        if (newValue) {
            handleFetchMessageUser();
            handleCountUnRead().then(() => {
                emit('value-changed', countUnRead.value);
            });
        }
    }
);

onMounted(() => {
    if (props.isChatVisible) {
        handleFetchMessageUser();
    }

})
</script>


<style scoped>
.card {
    width: 380px;
}

.card-notification {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
}

.card-body {
    display: flex;
    flex-direction: column-reverse;
    height: 400px;
    overflow-y: scroll;
}

.card-body::-webkit-scrollbar {
    width: 6px;
}

.card-body::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 10px;
}

.card-body::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

textarea.form-control {
    width: 100%;
    height: auto;
    resize: none;
    border: 1px solid #ced4da;
}

.chatbox-form {
    position: fixed;
    z-index: 9999;
    top: 58%;
    right: 8%;
    transform: translate(0, -50%);
    width: 400px;
    height: 60%;
}

/* Màn hình cực nhỏ (điện thoại nhỏ) */
@media only screen and (max-width: 320px) {
    .card {
        width: 280px;
    }

    .chatbox-form {
        top: 30%;
        right: 5%;
        width: 90%;
        height: 60%;
    }
}

/* Màn hình nhỏ (điện thoại thông thường) */
@media only screen and (min-width: 321px) and (max-width: 375px) {
    .card {
        width: 300px;
    }

    .chatbox-form {
        top: 28%;
        right: 18%;
        width: 85%;
        height: 60%;
    }
}

/* Màn hình điện thoại trung bình */
@media only screen and (min-width: 376px) and (max-width: 414px) {
    .card {
        width: 320px;
    }

    .chatbox-form {
        top: 50%;
        right: 21%;
        width: 80%;
        height: 60%;
    }
}

/* Màn hình điện thoại lớn */
@media only screen and (min-width: 415px) and (max-width: 767px) {
    .card {
        width: 350px;
    }

    .chatbox-form {
        top: 56%;
        right: 14%;
        width: 400px;
        height: 60%;
    }
}

/* Máy tính bảng nhỏ */
@media only screen and (min-width: 768px) and (max-width: 834px) {
    .card {
        width: 350px;
    }

    .chatbox-form {
        top: 58%;
        right: 10%;
        width: 450px;
        height: 65%;
    }
}

/* Máy tính bảng lớn */
@media only screen and (min-width: 835px) and (max-width: 1023px) {
    .card {
        width: 380px;
    }

    .chatbox-form {
        top: 40%;
        right: 14%;
        width: 480px;
        height: 65%;
    }
}

/* Màn hình desktop nhỏ */
@media only screen and (min-width: 1024px) and (max-width: 1279px) {
    .card {
        width: 400px;
    }

    .chatbox-form {
        top: 80%;
        right: 10%;
        width: 450px;
        height: 70%;
    }
}

/* Màn hình desktop trung bình */
@media only screen and (min-width: 1280px) and (max-width: 1439px) {
    .card {
        width: 450px;
    }

    .chatbox-form {
        top: 50%;
        right: 8%;
        width: 500px;
        height: 75%;
    }
}

/* Màn hình desktop lớn */
@media only screen and (min-width: 1440px) and (max-width: 1919px) {
    .card {
        width: 400px;
    }

    .chatbox-form {
        top: 60%;
        right: 8%;
        width: 480px;
        height: 80%;
    }
}

/* Màn hình cực lớn */
@media only screen and (min-width: 1920px) {
    .card {
        width: 400px;
    }

    .chatbox-form {
        top: 76%;
        right: 8%;
        width: 600px;
        height: 85%;
    }
}



#chat1 .form-outline .form-control~.form-notch div {
    pointer-events: none;
    border: 1px solid;
    border-color: #eee;
    box-sizing: border-box;
    background: transparent;
}

#chat1 .form-outline .form-control~.form-notch .form-notch-leading {
    left: 0;
    top: 0;
    height: 100%;
    border-right: none;
    border-radius: .65rem 0 0 .65rem;
}

#chat1 .form-outline .form-control~.form-notch .form-notch-middle {
    flex: 0 0 auto;
    max-width: calc(100% - 1rem);
    height: 100%;
    border-right: none;
    border-left: none;
}

#chat1 .form-outline .form-control~.form-notch .form-notch-trailing {
    flex-grow: 1;
    height: 100%;
    border-left: none;
    border-radius: 0 .65rem .65rem 0;
}

#chat1 .form-outline .form-control:focus~.form-notch .form-notch-leading {
    border-top: 0.125rem solid #39c0ed;
    border-bottom: 0.125rem solid #39c0ed;
    border-left: 0.125rem solid #39c0ed;
}

#chat1 .form-outline .form-control:focus~.form-notch .form-notch-leading,
#chat1 .form-outline .form-control.active~.form-notch .form-notch-leading {
    border-right: none;
    transition: all 0.2s linear;
}

#chat1 .form-outline .form-control:focus~.form-notch .form-notch-middle {
    border-bottom: 0.125rem solid;
    border-color: #39c0ed;
}

#chat1 .form-outline .form-control:focus~.form-notch .form-notch-middle,
#chat1 .form-outline .form-control.active~.form-notch .form-notch-middle {
    border-top: none;
    border-right: none;
    border-left: none;
    transition: all 0.2s linear;
}

#chat1 .form-outline .form-control:focus~.form-notch .form-notch-trailing {
    border-top: 0.125rem solid #39c0ed;
    border-bottom: 0.125rem solid #39c0ed;
    border-right: 0.125rem solid #39c0ed;
}

#chat1 .form-outline .form-control:focus~.form-notch .form-notch-trailing,
#chat1 .form-outline .form-control.active~.form-notch .form-notch-trailing {
    border-left: none;
    transition: all 0.2s linear;
}

#chat1 .form-outline .form-control:focus~.form-label {
    color: #39c0ed;
}

#chat1 .form-outline .form-control~.form-label {
    color: #bfbfbf;
}

.product-list .product-container {
    width: 100px;
    /* Giảm chiều rộng của thẻ sản phẩm */
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-color: #fff;
}

.product-list .product-image {
    width: 100%;
    height: 60px;
    /* Giảm chiều cao của hình ảnh sản phẩm */
    object-fit: cover;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.product-list .product-info {
    padding: 0.3rem;
    text-align: center;
}

.product-list .product-name {
    font-size: 0.7rem;
    /* Giảm kích thước chữ của tên sản phẩm */
    margin-bottom: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Hiển thị dấu chấm nếu tên sản phẩm quá dài */
}

.product-list .product-price {
    font-size: 0.65rem;
    /* Giảm kích thước chữ của giá sản phẩm */
    color: #555;
    margin: 0;
}
</style>