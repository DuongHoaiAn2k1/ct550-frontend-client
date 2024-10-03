<template>

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
                    <th class="col text-center">Giá bán</th>
                    <th class="col text-center">Hoa hồng</th>
                    <th class="col text-center">Đường dẫn</th>
                    <th class="col text-center"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in dataSearch" :key="item.affiliate_link_id
                    ">
                    <th scope="row" class="text-center">{{ index + 1 }}</th>
                    <td class="text-center">
                        {{ item.product.product_name }}
                    </td>

                    <td class="text-center">
                        {{ formatCurrency(item.product.product_price) }}
                    </td>

                    <td class="text-center">
                        {{ Math.floor(item.product.commission.commission_rate) }}%
                    </td>
                    <td class="text-center">
                        <span class="copyable" @dblclick="copyToClipboard(item.affiliate_link)">
                            {{ item.affiliate_link }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next" :total="Math.ceil(listProduct.length / pageSize) * 10" class="mt-4" />
        </div>
        <div v-show="dataSearch.length === 0">
            <p class="text-center">Không có sản phẩm nào</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import Cookies from 'js-cookie';
import affiliateService from '@/services/affiliate.service';
import { formatCurrency } from '@/helpers/UtilHelper';
import { showLoading } from '@/helpers/LoadingHelper';
import { showSuccess } from '@/helpers/NotificationHelper'
const search = ref('');
const currentPage = ref(1);
const pageSize = 10;
const listProduct = ref([]);


const fetchlistProduct = async () => {
    try {
        const response = await affiliateService.getByUser();
        console.log("List affiliate: ", response);
        listProduct.value = response.data;
    } catch (error) {
        console.log(error.response);
    }
}

const dataSearch = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (!search.value) {
        return listProduct.value?.slice(startIndex, endIndex);
    } else {
        return listProduct.value?.filter(item => item.product.product_name.toLowerCase().includes(search.value.toLowerCase())).slice(startIndex, endIndex);
    }
})

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Copy thành công');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
};


onMounted(() => {
    fetchlistProduct();
})


const handleCurrentChange = (val) => {
    currentPage.value = val;
}

</script>

<style scoped>
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

.copyable {
    cursor: pointer;
    text-decoration: underline;
    position: relative;
}

.copyable:hover {
    color: #007bff;
}

.copyable::after {
    content: "Double-click to copy";
    /* Tooltip text */
    position: absolute;
    top: 100%;
    /* Position below the text */
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 3px;
    white-space: nowrap;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
}

.copyable:hover::after {
    opacity: 1;
}
</style>