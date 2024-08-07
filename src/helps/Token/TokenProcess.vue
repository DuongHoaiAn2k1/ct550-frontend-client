<template>
    <!-- Nội dung của template nếu có -->
</template>

<script setup>
import { onMounted } from "vue";
import { ElLoading, ElNotification } from "element-plus";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Khởi tạo các biến và dịch vụ
const authStore = useAuthStore();
const router = useRouter();

// Hàm để hiển thị thông báo thành công
const showLoginSuccess = () => {
    ElNotification({
        title: 'Đăng nhập thành công',
        message: 'Đăng nhập thành công với Google. Đang chuyển trang...',
        type: 'success',
    });
};

// Hàm để hiển thị thông báo cảnh báo
const showLoginWarning = () => {
    ElNotification({
        title: 'Đăng nhập thất bại',
        message: 'Đăng nhập thất bại hoặc không có thông tin đăng nhập. Vui lòng thử lại.',
        type: 'warning',
    });
};

// Hàm để xử lý đăng nhập
const handleLogin = (accessToken, refreshToken, userId) => {
    if (accessToken && refreshToken && userId) {
        // Lưu token vào store hoặc dịch vụ
        authStore.setTokens({ accessToken, refreshToken });
        authStore.setUserId(userId);

        showLoginSuccess();

        // Chuyển hướng đến trang chính hoặc trang mong muốn
        router.push({ name: 'home' }); // Hoặc trang bạn muốn chuyển đến
    } else {
        showLoginWarning();
        // Có thể chuyển hướng về trang đăng nhập hoặc trang lỗi
        router.push({ name: 'login' });
    }
};

// Phân tích URL và lấy các tham số
onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const userId = urlParams.get('user_id');

    handleLogin(accessToken, refreshToken, userId);
});
</script>