<template>
    <div class="product-title-card">
        <p class="text-center mb-2 title">{{ title }}</p>
        <div class="row">
            <ProductCard v-for="product in product" :key="product.product_id" :price="product.product_price"
                :productName="product.product_name" :productId="product.product_id" :product="product"
                :image="'https://dacsancamau.com/storage/' + JSON.parse(product.product_img)[0]"
                :liked.sync="product.liked" @handleCreateProductLike="handleCreateProductLike" />
        </div>

    </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue';

const emit = defineEmits(['handleCreateProductLike']);


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

const handleCreateProductLike = (productId, liked) => {
    emit('handleCreateProductLike', productId, liked);
}


console.log("Product in title card: ", props);
</script>

<style scoped>
.title {
    font-weight: 600;
    font-size: 24px;
}
</style>