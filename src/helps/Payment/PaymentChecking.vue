<template>
    <div>
        <el-result v-show="showResult" icon="success" title="Thanh toán thành công"
            sub-title="Đơn hàng đã được đặt thành công">
            <template #extra>
                <el-button style="background-color: #234A2B; color: white;"><router-link
                        style="text-decoration: none; color: white;" :to="{ name: 'home' }">Tiếp tục
                        mua
                        sắm</router-link></el-button>
            </template>
        </el-result>

        <el-result v-show="showFailed" icon="error" title="Thanh toán thất bại"
            sub-title="Vui lòng kiểm tra thông tin thanh toán và thực hiện lại giao dịch">
            <template #extra>
                <el-button style="background-color: #234A2B; color: white;"><router-link
                        style="text-decoration: none; color: white;" :to="{ name: 'home' }">Tiếp tục
                        mua
                        sắm</router-link></el-button>
            </template>
        </el-result>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import paymentService from '../../services/payment.service';
import { useRoute } from 'vue-router';
import { showLoading } from '../../helpers/LoadingHelper';
import orderService from '../../services/order.service';

const route = useRoute();
const showResult = ref(false);
const showFailed = ref(false);

const handlePaymentChecking = async (params) => {
    const loading = showLoading();
    try {
        const response = await paymentService.paymentCheckout(params);
        if (response.code == '00') {
            setTimeout(() => {
                loading.close();
                showResult.value = true;
                showFailed.value = false;
                orderService.updateStatus({
                    status: 'preparing'
                }, route.query.vnp_TxnRef);
            }, 1500);
        } else {
            setTimeout(() => {
                loading.close();
                showResult.value = false;
                showFailed.value = true;
            }, 1500);
        }

        console.log('Checking response: ', response);


    } catch (error) {
        console.log(error.response);
    }
}

onMounted(() => {
    const params = {
        vnp_Amount: route.query.vnp_Amount,
        vnp_BankCode: route.query.vnp_BankCode,
        vnp_BankTranNo: route.query.vnp_BankTranNo,
        vnp_CardType: route.query.vnp_CardType,
        vnp_OrderInfo: route.query.vnp_OrderInfo,
        vnp_PayDate: route.query.vnp_PayDate,
        vnp_ResponseCode: route.query.vnp_ResponseCode,
        vnp_TmnCode: route.query.vnp_TmnCode,
        vnp_TransactionNo: route.query.vnp_TransactionNo,
        vnp_TransactionStatus: route.query.vnp_TransactionStatus,
        vnp_TxnRef: route.query.vnp_TxnRef,
        vnp_SecureHash: route.query.vnp_SecureHash
    };

    console.log("Params: ", params);
    handlePaymentChecking({
        vnp_Amount: route.query.vnp_Amount,
        vnp_BankCode: route.query.vnp_BankCode,
        vnp_BankTranNo: route.query.vnp_BankTranNo,
        vnp_CardType: route.query.vnp_CardType,
        vnp_OrderInfo: route.query.vnp_OrderInfo,
        vnp_PayDate: route.query.vnp_PayDate,
        vnp_ResponseCode: route.query.vnp_ResponseCode,
        vnp_TmnCode: route.query.vnp_TmnCode,
        vnp_TransactionNo: route.query.vnp_TransactionNo,
        vnp_TransactionStatus: route.query.vnp_TransactionStatus,
        vnp_TxnRef: route.query.vnp_TxnRef,
        vnp_SecureHash: route.query.vnp_SecureHash
    });
});
</script>

<style scoped>
.error {
    color: red;
}
</style>
