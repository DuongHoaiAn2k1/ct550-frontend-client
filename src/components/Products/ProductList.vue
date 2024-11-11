<template>
    <div class="row row-underline">
        <el-scrollbar>
            <div class="scrollbar-flex-content">
                <div v-for="product in listProductByCategory" :key="product.product_id" class="scrollbar-demo-item">
                    <div class="card h-70 shadow-sm mb-3">
                        <router-link :to="{ name: 'product-detail', params: { id: product.product_id } }">
                            <img :src="apiUrl + JSON.parse(product.product_img)[0]" class="card-img-top-2"
                                alt="product.title" />
                        </router-link>
                        <div class="card-body">
                            <h5 style="margin-bottom: 0px" class="card-title">
                                <p class="name-product-2">{{ product.product_name }}</p>
                                <p style="margin-bottom: 0px !important; font-weight: 600; font-size: 15px;"
                                    class="text-danger text-center">
                                    {{ formatCurrency(product.product_price) }}/kg
                                </p>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup>
const apiUrl = import.meta.env.VITE_APP_API_URL;
// Define props
const props = defineProps({
    listProductByCategory: {
        type: Array,
        required: true
    },
    formatCurrency: {
        type: Function,
        required: true
    }
});
</script>

<style scoped>
/* Include the necessary styles here or move to a global stylesheet */
.scrollbar-flex-content {
    display: flex;
}

.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
}

.name-product-2 {
    font-size: 16px;
}

.card-img-top-2 {
    width: 180px;
}
</style>