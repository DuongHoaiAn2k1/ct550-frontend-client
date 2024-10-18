<template>
    <div>
        <el-autocomplete v-model="state" :fetch-suggestions="querySearchAsync" placeholder="Nhập từ khóa tìm kiếm"
            :debounce="300">

            <template #default="{ item }">
                <div v-show="!haveResult" class="suggestion-item">
                    <span>Không tìm thấy</span>
                </div>
                <div v-show="haveResult" class="suggestion-item mt-2">
                    <img :src="apiUrl + item.image" alt="Product Image" class="product-image me-2" width="40" />
                    <span class="ms-2 me-2">{{ item.value }}</span>
                    <router-link :to="{ name: 'product-detail', params: { id: item.id } }">Đi đến</router-link>
                </div>
            </template>

            <template #loading>
                <el-icon class="is-loading">
                    <svg class="circular" viewBox="0 0 20 20">
                        <g class="path2 loading-path" stroke-width="0" style="animation: none; stroke: none">
                            <circle r="3.375" class="dot1" rx="0" ry="0" />
                            <circle r="3.375" class="dot2" rx="0" ry="0" />
                            <circle r="3.375" class="dot4" rx="0" ry="0" />
                            <circle r="3.375" class="dot3" rx="0" ry="0" />
                        </g>
                    </svg>
                </el-icon>
            </template>

            <template #suffix>
                <el-button @click="handleSearchClick" style="border: none;"><el-icon>
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </el-icon></el-button>
            </template>
        </el-autocomplete>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import debounce from 'lodash/debounce';
import searchService from '../../services/search.service';
import { useRouter } from 'vue-router';

const router = useRouter();
const apiUrl = import.meta.env.VITE_APP_API_URL;
const state = ref('');
const products = ref([]);
const haveResult = ref(false);

const querySearchAsync = debounce(async (queryString, cb) => {
    if (queryString) {
        try {
            const response = await searchService.search(queryString);
            products.value = response.data;
            console.log("Search data: ", products.value);
            let results = [];
            if (products.value.length > 0) {
                results = products?.value?.map(product => ({
                    value: product.product_name,
                    id: product.product_id,
                    image: JSON.parse(product.product_img)[0]
                }));
                haveResult.value = true;
            } else {
                results = [{ value: 'Không tìm được sản phẩm', link: '', image: '' }];
                haveResult.value = false;
            }
            cb(results);
        } catch (error) {
            console.error('Error fetching search data:', error);
        }
    } else {
        cb([]);
    }
}, 300); // Debounce thời gian 300ms


const handleSearchClick = () => {
    if (state.value) {
        router.push({ name: 'search', query: { q: state.value } });
    }
};
</script>

<style scoped>
.circular {
    display: inline;
    height: 30px;
    width: 30px;
    animation: loading-rotate 2s linear infinite;
}

/* Các style cho loading */
.path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: var(--el-color-primary);
    stroke-linecap: round;
}

.loading-path .dot1 {
    transform: translate(3.75px, 3.75px);
    fill: var(--el-color-primary);
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
}

.loading-path .dot2 {
    transform: translate(calc(100% - 3.75px), 3.75px);
    fill: var(--el-color-primary);
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
    animation-delay: 0.4s;
}

.loading-path .dot3 {
    transform: translate(3.75px, calc(100% - 3.75px));
    fill: var(--el-color-primary);
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
    animation-delay: 1.2s;
}

.loading-path .dot4 {
    transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
    fill: var(--el-color-primary);
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
    animation-delay: 0.8s;
}

@keyframes loading-rotate {
    to {
        transform: rotate(360deg);
    }
}

@keyframes loading-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
    }

    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
    }
}

@keyframes custom-spin-move {
    to {
        opacity: 1;
    }
}
</style>
