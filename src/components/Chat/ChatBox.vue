<template>
    <section class="chatbox-form">
        <div class="container py-5" style="width: 65%; height: 60%;">

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
                                    class="d-flex flex-row justify-content-start">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                        alt="avatar 1" style="width: 45px; height: 100%;">
                                    <div class="p-3 ms-3"
                                        style="border-radius: 15px; background-color: rgba(57, 192, 237, .2);">
                                        <p class="small mb-0">{{ message.message }}</p>
                                    </div>
                                </div>

                                <!-- Nếu là tin nhắn của khách hàng -->
                                <div v-if="message.sender_id == authStore.user_id"
                                    class="d-flex flex-row justify-content-end">
                                    <div class="p-3 me-3 border bg-body-tertiary" style="border-radius: 15px;">
                                        <p class="small mb-0">{{ message.message }}</p>
                                    </div>
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                        alt="avatar 1" style="width: 45px; height: 100%;">
                                </div>
                            </div>

                        </div>
                        <div>
                            <input v-model="messageSend" type="text" class="form-control" placeholder="Nhập nội dung..."
                                @keyup.enter="handleCreateMessage">
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </section>
</template>


<script setup>
import { onMounted, ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { initializeEcho } from "../../pusher/echoConfig";
import messageService from "@/services/message.service";
const messages = ref([]);
const authStore = useAuthStore();
const echoInstance = initializeEcho();
const messageSend = ref("");
const userId = computed(() => authStore.user_id);

echoInstance.channel(`chat.${userId.value}`).listen('.message.sent', async (event) => {
    // const response = await notificationStore.getAll();
    handleFetchMessageUser();
});
const handleCreateMessage = async () => {
    try {
        const response = await messageService.create({
            message: messageSend.value,
            sender_id: authStore.user_id
        });

        messageSend.value = "";


        console.log(response);

        handleFetchMessageUser();
    } catch (error) {
        console.log(error);
    }
}
const handleFetchMessageUser = async () => {
    try {
        const response = await messageService.get(authStore.user_id);
        messages.value = response.data;
        console.log("Message: ", response);
    } catch (error) {
        console.log(error.response);
    }
}

const emit = defineEmits(['toggleChat']);

const closeChat = () => {

    emit('toggleChat');
}


onMounted(() => {
    handleFetchMessageUser();
})
</script>


<style scoped>
.card-notification {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
}

.card-body {
    display: flex;
    flex-direction: column-reverse;
    /* Đảo chiều hiển thị tin nhắn */
    height: 400px;
    /* Tạo chiều cao cố định */
    overflow-y: scroll;
    /* Hiển thị thanh cuộn khi có quá nhiều tin nhắn */
}

.card-body::-webkit-scrollbar {
    width: 6px;
    /* Tạo kích thước thanh cuộn */
}

.card-body::-webkit-scrollbar-thumb {
    background-color: #aaa;
    /* Màu thanh cuộn */
    border-radius: 10px;
}

.card-body::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

textarea.form-control {
    width: 100%;
    height: auto;
    resize: none;
    /* Ngăn kéo kích thước nếu không muốn */
    border: 1px solid #ced4da;
}

.chatbox-form {
    position: fixed;
    z-index: 9999;
    /* top: 0; */
    /* left: 60%; */
    right: -56%;
    bottom: 32%;
    width: 100%;
    height: 60%;
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
</style>