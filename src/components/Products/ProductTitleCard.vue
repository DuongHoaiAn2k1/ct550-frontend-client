<template>
    <div class="product-title-card">
        <p class="text-center mb-2 title">{{ title }}</p>
        <div class="row">
            <ProductCard v-for="product in product" :key="product.product_id" :price="product.product_price"
                :productName="product.product_name"
                :image="'https://dacsancamau.com/storage/' + JSON.parse(product.product_img)[0]"
                productName="Tom Kho Loai Da Cua" subTitle="Tom Kho Loai Da Cua" />
        </div>

    </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    product: {
        type: Array,
        required: true
    }
});


console.log("Product in title card: ", props);
</script>

<style scoped>
.title {
    font-weight: 600;
    font-size: 24px;
}
</style>