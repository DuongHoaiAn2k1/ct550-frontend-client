<template>
    <div class="card-body">
        <div class="row align-items-start border-bottom pb-3">
            <div class="col-md-7 d-flex">
                <div class="me-4">
                    <img alt="" :src="'https://dacsancamau.com/storage/' + productImg" class="avatar-lg rounded" />
                </div>
                <div class="flex-grow-1 align-self-center overflow-hidden">
                    <div>
                        <h5 class="text-truncate font-size-18">
                            <a href="#" class="text-dark">{{ product.product_name }}</a>
                        </h5>
                        <p class="text-muted mb-0">
                            <i class="bx bxs-star text-warning"></i>
                            <i class="bx bxs-star text-warning"></i>
                            <i class="bx bxs-star text-warning"></i>
                            <i class="bx bxs-star text-warning"></i>
                            <i class="bx bxs-star-half text-warning"></i>
                        </p>
                        <p class="mb-0 mt-1">
                            Giá : <span class="fw-medium">{{ formatCurrency(product.product_price) }}</span>
                        </p>
                    </div>
                </div>
                <div class="flex-shrink-0 ms-2">
                    <ul class="list-inline mb-0 font-size-16">
                        <li class="list-inline-item">
                            <a href="#" class="text-muted px-1" @click="$emit('delete', cart.cart_id)">
                                <i class="mdi mdi-trash-can-outline"></i>
                            </a>
                        </li>
                        <li class="list-inline-item">
                            <a href="#" class="text-muted px-1">
                                <i class="mdi mdi-heart-outline"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-md-2">
                <p class="text-muted mb-3">Số lượng</p>
                <div class="d-inline-flex">
                    <button @click="$emit('decrement', cart)" class="btn btn-sm btn-outline-secondary">
                        -
                    </button>
                    <span class="mx-2">{{ cart.quantity }}</span>
                    <button @click="$emit('increment', cart)" class="btn btn-sm btn-outline-secondary">
                        +
                    </button>
                </div>
            </div>
            <div class="col-md-2">
                <div class="mt-1">
                    <p class="text-muted mb-3">Tổng</p>
                    <h5>{{ formatCurrency(product.product_price * cart.quantity) }}</h5>
                </div>
            </div>
            <div class="col-md-1">
                <div class="mt-1">
                    <div class="mt-4">
                        <a @click="$emit('delete', cart.cart_id)" class="delete-btn">
                            <i class="fa fa-trash" style="color: #234A2B;"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useProductStore } from '@/stores/product';
import { formatCurrency } from '@/helpers/UtilHelper';
const productStore = useProductStore();
const product = ref({});
const productImg = ref("");
const props = defineProps({
    cart: Object,
    productId: Number,
});

onMounted(async () => {
    console.log("Product id: ", props.productId);
    await productStore.fetchListProduct().finally(() => {
        product.value = productStore.getProductById(props.productId);
        productImg.value = JSON.parse(product.value.product_img)[0];
        console.log("Product hahaha:", product);
    })
});
</script>

<style scoped>
.avatar-lg {
    height: 5rem;
    width: 5rem;
}

.font-size-18 {
    font-size: 18px !important;
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.flex-grow-1 {
    flex-grow: 1;
}
</style>