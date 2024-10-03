<template>
    <div class="card-body">
        <div class="form-group pull-right contain-search">
        </div>

        <table class="table table-hover table-bordered results">
            <thead>
                <tr>
                    <th class="col text-center">STT</th>
                    <th class="col text-center">Mã đơn hàng</th>
                    <th class="col text-center">Sản phẩm</th>
                    <th class="col text-center">Số lượng</th>
                    <th class="col text-center">Mức hoa hồng</th>
                    <th class="col text-center">Ngày tạo</th>
                    <th class="col text-center">Hoa hồng nhận</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in pagigationData" :key="item.
                    affiliate_sale_id

                    ">
                    <th scope="row" class="text-center">{{ index + 1 }}</th>
                    <td class="text-center">
                        {{ item.order.bill_id }}
                    </td>
                    <td class="text-center">
                        {{ item.product.product_name }}
                    </td>

                    <td class="text-center">
                        {{ getQuantity(item.order.order_detail, item.product_id) }}
                    </td>

                    <td class="text-center">
                        {{ Math.floor(item.commission_rate) }}%
                    </td>
                    <td class="text-center">
                        {{ convertTime(item.created_at) }}
                    </td>
                    <td class="text-center">
                        {{ formatCurrency(item.commission_amount) }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next" :total="Math.ceil(orderSales.length / pageSize) * 10" class="mt-4" />
        </div>
        <div v-show="orderSales.length === 0">
            <p class="text-center">Không có sản phẩm nào</p>
        </div>
    </div>


</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import affiliateService from "../../services/affiliate.service";
import { convertTime, formatCurrency } from '../../helpers/UtilHelper'

const orderSales = ref([]);
const currentPage = ref(1);
const pageSize = 8;

const fetchListOrderSales = async () => {
    try {
        const response = await affiliateService.getSale();
        console.log("List affiliate: ", response);
        orderSales.value = response.data;
    } catch (error) {
        console.log(error);
    }
};


const getQuantity = (data, id) => {
    return data.find(item => item.product_id === id).quantity;
}

onMounted(() => {
    fetchListOrderSales();
});

const pagigationData = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return orderSales.value.slice(startIndex, endIndex);
});

const handleCurrentChange = (val) => {
    currentPage.value = val;
}

</script>