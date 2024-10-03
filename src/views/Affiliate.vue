<template>
    <div class="d-flex">
        <div class="l-navbar">
            <nav class="nav">
                <div>
                    <a href="#" class="nav_logo">
                        <i class="fa-solid fa-shop"></i>&nbsp;
                        <span class="nav_logo-name">Tiếp thị</span>
                    </a>
                    <div class="nav_list">
                        <a href="#" class="nav_link" :class="{ active: activeTab === 'product' }"
                            @click="activeTab = 'product'">
                            <i class='bx bx-grid-alt nav_icon'></i>
                            <span class="nav_name">Sản phẩm</span>
                        </a>
                        <a href="#" class="nav_link" :class="{ active: activeTab === 'myProduct' }"
                            @click="activeTab = 'myProduct'">
                            <i class='bx bx-user nav_icon'></i>
                            <span class="nav_name">Của tôi</span>
                        </a>
                        <a href="#" class="nav_link" :class="{ active: activeTab === 'money' }"
                            @click="activeTab = 'money'">
                            <i class="fa-solid fa-money-bill nav_icon"></i>
                            <span class="nav_name">Rút tiền</span>
                        </a>
                    </div>
                </div>
            </nav>
        </div>

        <!-- Content Area -->
        <div class="content-area">
            <div v-if="activeTab === 'product'">
                <h4>Danh sách sản phẩm tiếp thị</h4>
                <p>Hãy lựa chọn các sản phẩm cho chiến dịch tiếp thị của bạn</p>
                <div class="card-body">
                    <div class="form-group pull-right contain-search">
                        <input type="text" class="search form-control form-design" placeholder="Nhập từ khóa tìm kiếm"
                            v-model="search" />
                    </div>

                    <table class="table table-hover table-bordered results">
                        <thead>
                            <tr>
                                <th class="col text-center">STT</th>
                                <th class="col text-center">Tên sản phẩm</th>
                                <th class="col text-center">Hình ảnh</th>
                                <th class="col text-center">Giá bán</th>
                                <th class="col text-center">Hoa hồng</th>
                                <th class="col text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in dataSearch" :key="item.commision_id">
                                <th scope="row" class="text-center">{{ index + 1 }}</th>
                                <td class="text-center">{{ item.product.product_name }}
                                </td>
                                <td class="text-center"><img
                                        :src="'https://dacsancamau.com/storage/' + JSON.parse(item.product.product_img)[0]"
                                        alt="" width="50px">
                                </td>
                                <td class="text-center">
                                    {{ formatCurrency(item.product.product_price) }}
                                </td>
                                <td class="text-center">{{ Math.floor(item.commission_rate) }}%</td>
                                <td class="text-center"> <el-button
                                        v-show="item.product?.affiliate?.affiliate_user_id != Cookies.get('user_id')"
                                        @click="handleGenerateLink(item.product.product_id)">Lấy liên kết tiếp
                                        thị</el-button>

                                    <el-button type="danger"
                                        v-show="item.product?.affiliate?.affiliate_user_id == Cookies.get('user_id')">Đã
                                        có liên kết</el-button>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                    <div class="text-end">
                        <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small
                            background layout="prev, pager, next"
                            :total="Math.ceil(listCommission.length / pageSize) * 10" class="mt-4" />
                    </div>
                    <div v-show="dataSearch.length === 0">
                        <p class="text-center">Không có sản phẩm nào</p>
                    </div>
                </div>
            </div>
            <div v-if="activeTab === 'myProduct'">
                <h4>Sản phẩm tiếp thị của bạn</h4>
                <UserProductTable />
            </div>
            <div v-if="activeTab === 'money'">
                <h4>Thu nhập từ tiếp thị</h4>
                <el-tabs type="border-card" class="demo-tabs">
                    <el-tab-pane label="Đơn hàng tiếp thị">
                        <OrderDataTable />
                    </el-tab-pane>
                    <el-tab-pane label="Rút tiền">
                        <h4>Tổng số dư </h4>
                        <div class="d-flex align-items-center">
                            <h5> <i class="fa-solid fa-wallet"></i> {{ formatCurrency(balance) }}</h5>
                            <el-button small class="ms-3" @click="showFormRequest = true">Rút tiền</el-button>
                        </div>
                        <h5 class="mt-3">Lịch sử rút tiền</h5>
                        <WithdrawalTable class="mt-3" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
    <el-dialog v-model="showFormRequest" title="Yêu cầu rút tiền" width="700" center>
        <div class="mb-3 row">
            <label for="money" class="col-sm-2 col-form-label">Số tiền rút</label>
            <div class="col-sm-10">
                <input type="text" v-model="withDrawalData.amount" class="form-control" id="money" />
                <span class="text-danger ">{{ amountError }}</span>
            </div>

        </div>
        <div class="mb-3 row">
            <label for="bankName" class="col-sm-2 col-form-label">Ngân hàng</label>
            <div class="col-sm-10">
                <el-select v-model="withDrawalData.bankName" placeholder="Chọn ngân hàng" style="width: 240px">
                    <el-option v-for="item in bankData.data" :key="item.name" :value="item.name">
                        {{ item.name }}
                        <img :src="item.logo" width="80px" alt="">
                    </el-option>

                </el-select>
                <span class="text-danger  d-block">{{ bankNameError }}</span>
            </div>
        </div>
        <div class="row"></div>
        <div class="mb-3 row">
            <label for="accountNumber" class="col-sm-2 col-form-label">Số tài khoản</label>
            <div class="col-sm-10">
                <input type="text" v-model="withDrawalData.accountNumber" class="form-control" id="accountNumber" />
                <span class="text-danger ">{{ accountNumberError }}</span>
            </div>

        </div>
        <div class="mb-3 row">
            <label for="accountHolderName" class="col-sm-2 col-form-label">Tên chủ thẻ</label>
            <div class="col-sm-10">
                <input type="text" v-model="withDrawalData.accountHolderName" class="form-control"
                    id="accountHolderName" />
                <span class="text-danger ">{{ accountHolderNameError }}</span>
            </div>

        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showFormRequest = false">Hủy</el-button>
                <el-button type="primary" @click="hanleWithDrawal">
                    Gửi yêu cầu
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import affiliateService from '../services/affiliate.service';
import { formatCurrency } from '../../../admin/src/helpers/UtilHelper';
import { showLoading } from '../helpers/LoadingHelper';
import { showSuccess } from '../helpers/NotificationHelper';
import UserProductTable from '../components/Affiliate/UserProductTable.vue';
import OrderDataTable from '../components/Affiliate/OrderDataTable.vue';
import WithdrawalTable from '../components/Affiliate/WithdrawalTable.vue';
import bankData from '../assets/bank/bank.json';
const showFormRequest = ref(false);
const activeTab = ref('product');
const search = ref('');
const currentPage = ref(1);
const pageSize = 10;
const listCommission = ref([]);
const balance = ref(0);


const withDrawalSchema = Yup.object().shape({
    amount: Yup.number().required('Số tiền rút không được để trống').min(1000, 'Số tiền rút tối thiểu 1000 VNĐ'),
    bankName: Yup.string().required('Tên ngân hàng không được để trống'),
    accountNumber: Yup.string().required('Số tài khoản không được để trống'),
    accountHolderName: Yup.string().required('Tên chủ thẻ không được để trống')
});
const withDrawalData = ref({
    amount: 0,
    bankName: '',
    accountNumber: '',
    accountHolderName: ''
});


const amountError = ref('');
const bankNameError = ref('');
const accountNumberError = ref('');
const accountHolderNameError = ref('');

const fetchlistCommission = async () => {
    try {
        const response = await affiliateService.getListCommission();
        console.log("List commission: ", response);
        listCommission.value = response.data;
    } catch (error) {
        console.log(error.response);
    }
}

const fetchBalance = async () => {
    try {
        const response = await affiliateService.getBalance();
        balance.value = response.data;
        console.log("Balance: ", response);
    } catch (error) {
        console.log(error.response);
    }
}

const hanleWithDrawal = async () => {

    withDrawalSchema.validate(withDrawalData.value, { abortEarly: false }).then(async () => {
        amountError.value = '';
        bankNameError.value = '';
        accountNumberError.value = '';
        accountHolderNameError.value = '';
        const loading = showLoading();
        const response = await affiliateService.createWithdraw({
            amount: withDrawalData.value.amount,
            bank_name: withDrawalData.value.bankName,
            account_number: withDrawalData.value.accountNumber,
            account_holder_name: withDrawalData.value.accountHolderName
        });
        // console.log('withdraw data: ', withDrawalData.value);
        console.log(response);
        setTimeout(() => {
            showFormRequest.value = false;
            loading.close();
            showSuccess('Yêu cầu rút tiền đã được gửi đi');
            fetchBalance();
        }, 1000);
    }).catch((errors) => {
        errors.inner.forEach((error) => {
            if (error.path == "amount") {
                amountError.value = error.message;
            }
            if (error.path == "bankName") {
                bankNameError.value = error.message;
            }
            if (error.path == "accountNumber") {
                accountNumberError.value = error.message;
            }
            if (error.path == "accountHolderName") {
                accountHolderNameError.value = error.message;
            }
        })
    })

}

const dataSearch = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (!search.value) {
        return listCommission.value?.slice(startIndex, endIndex);
    } else {
        return listCommission.value?.filter(item => item.product.product_name.toLowerCase().includes(search.value.toLowerCase())).slice(startIndex, endIndex);
    }
})

const handleGenerateLink = async (id) => {
    try {
        const loading = showLoading();
        const response = await affiliateService.generateLink(id);
        console.log(response);
        setTimeout(() => {
            showSuccess("Lấy liên kết thành công");
            loading.close();
        }, 1000)
    } catch (error) {
        console.log(error.response);
    }
}

onMounted(() => {
    fetchlistCommission();
    fetchBalance();
    console.log('bank data: ', bankData)
})


watch(withDrawalData.value, (newVal) => {
    if (newVal) {
        amountError.value = '';
        bankNameError.value = '';
        accountNumberError.value = '';
        accountHolderNameError.value = '';
    }
})

const handleCurrentChange = (val) => {
    currentPage.value = val;
}

</script>

<style scoped>
:deep(.demo-tabs .el-tabs__header) {
    background-color: #333 !important;
    color: white;
}

:deep(.demo-tabs .el-tabs__header .el-tabs__item) {
    color: white;
    /* Màu mặc định của tiêu đề */
}

:deep(.demo-tabs .el-tabs__header .is-active) {
    color: black;
    /* Màu khi click */
}

:deep(.el-transfer .el-transfer-panel) {
    width: 20% !important;
    border: 1px solid #6b778c !important;
}

:deep(.el-transfer__buttons button) {
    background-color: black !important;
}

.d-flex {
    display: flex;
}

.l-navbar {
    width: 220px;
    background-color: #11101d;
    padding: 1.5rem 1rem;
    height: 100vh;
}

.nav {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.nav_logo {
    font-size: 1.25rem;
    color: #ffffff;
    margin-bottom: 2rem;
    text-decoration: none;
    display: flex;
    align-items: center;
}

.nav_logo-icon {
    font-size: 1.5rem;
    margin-right: 0.5rem;
}

.nav_logo-name {
    font-weight: bold;
}

.nav_list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.nav_link {
    display: flex;
    align-items: center;
    color: #a5a1aa;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease;
}

.nav_link:hover {
    background-color: #1b1d32;
    color: #ffffff;
}

.nav_link.active {
    background-color: #1b1d32;
    color: #ffffff;
}

.nav_icon {
    font-size: 1.5rem;
    margin-right: 0.75rem;
}

.content-area {
    padding: 2rem;
    flex-grow: 1;
    /* Content area will grow to fill remaining space */
    background-color: #f8f9fa;
}

.contain-search {
    display: flex;
}

.form-design {
    width: 220px;

}

.design-input {
    border: none;
}

.design-button {
    padding: 4px 16px;
}

.border-none {
    border: none;
}
</style>
