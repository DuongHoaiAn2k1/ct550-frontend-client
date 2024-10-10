<template>
    <div class="card mx-2 col col-md-3 mb-1">
        <div class="image-container">
            <router-link :to="{ name: 'product-detail', params: { id: productId } }">
                <img :src="image" />
            </router-link>
            <div class="price">{{ product.product_promotion.length != 0 ? formatCurrency(price -
                product.product_promotion[0].discount_price) : formatCurrency(product.product_price) }}</div>
        </div>
        <label class="favorite">
            <input type="checkbox" :checked="liked" @click="handleCreateProductLike(productId)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000">
                <path
                    d="M12 20a1 1 0 0 1-.437-.1C11.214 19.73 3 15.671 3 9a5 5 0 0 1 8.535-3.536l.465.465.465-.465A5 5 0 0 1 21 9c0 6.646-8.212 10.728-8.562 10.9A1 1 0 0 1 12 20z">
                </path>
            </svg>
        </label>

        <div class="content">
            <div class="brand">{{ productName }}</div>
            <div v-show="product.product_promotion.length != 0 && JSON.parse(product.product_promotion[0].promotion.user_group).includes(atob(Cookies.get('role')))"
                class="product-name">
                <span class="original-price">{{ formatCurrency(product.product_price) }}</span>
                <span class="discount">-{{ product?.product_promotion[0]?.promotion?.discount_percentage }}%</span>
            </div>
            <div v-show="product.product_promotion.length == 0" class="product-name">
                <span style="color: white;">0</span>
                <span style="color: white;"> 0</span>
            </div>

            <div class="rating">
                <el-rate v-model="averageRating" disabled show-score text-color="#ff9900"
                    score-template="{value} điểm" />

            </div>
        </div>

        <div class="button-container">
            <button class="buy-button button" :disabled="!product.available_quantity"
                :class="product.available_quantity ? '' : 'button-disabled'"
                @click="handleBuyNow(product.product_id, product.weight)">{{
                    product.available_quantity ? 'Mua ngay' : 'Hết hàng' }}</button>
            <button class="cart-button button" :disabled="!product.available_quantity"
                :class="product.available_quantity ? '' : 'button-disabled'"
                @click="addToCart(productId, product.weight)">
                <svg viewBox="0 0 27.97 25.074" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0,1.175A1.173,1.173,0,0,1,1.175,0H3.4A2.743,2.743,0,0,1,5.882,1.567H26.01A1.958,1.958,0,0,1,27.9,4.035l-2.008,7.459a3.532,3.532,0,0,1-3.4,2.61H8.36l.264,1.4a1.18,1.18,0,0,0,1.156.955H23.9a1.175,1.175,0,0,1,0,2.351H9.78a3.522,3.522,0,0,1-3.462-2.865L3.791,2.669A.39.39,0,0,0,3.4,2.351H1.175A1.173,1.173,0,0,1,0,1.175ZM6.269,22.724a2.351,2.351,0,1,1,2.351,2.351A2.351,2.351,0,0,1,6.269,22.724Zm16.455-2.351a2.351,2.351,0,1,1-2.351,2.351A2.351,2.351,0,0,1,22.724,20.373Z"
                        id="cart-shopping-solid"></path>
                </svg>

            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { addToCart } from '../../helpers/CartHelper';
import { formatCurrency } from '../../helpers/UtilHelper';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import cartService from '@/services/cart.service';
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const cartStore = useCartStore();
const atob = (str) => window.atob(str);
const emit = defineEmits(['handleCreateProductLike']);
const router = useRouter();

const averageRating = ref(0);

const props = defineProps({
    productId: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    product: {
        type: Object,
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    liked: {
        type: Boolean,
        required: true
    }
});

const handleCreateProductLike = () => {

    emit('handleCreateProductLike', props.productId);
    props.liked = !props.liked;
}
const handleBuyNow = (product_id, weight) => {
    handleAddToCart(product_id, weight);
    router.push({ name: "cart" });
};

const handleAddToCart = async (product_id, weight) => {
    try {
        const user_id = authStore.user_id;
        const response = await cartService.create({
            user_id: user_id,
            product_id: product_id,
            quantity: 1,
            total_weight: weight,
        });
        await cartStore.fetchCartCount();
        console.log("response: ", response);
    } catch (error) {
        console.log(error.response);
    }
};

onMounted(() => {
    averageRating.value = props.product.average_rating || 0;
}),

    console.log("props in product card: ", props);
</script>

<style scoped>
.product-name {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 10px;
}

.product-name .original-price {
    text-decoration: line-through;
    /* Gạch ngang giá ban đầu */
    color: red;
    /* Bạn có thể chọn màu khác nếu muốn */
}

.product-name .discount {
    color: green;
    /* Màu chữ cho mức giảm giá */
}

.card {
    --accent-color: #ffd426;
    position: relative;
    width: 240px;
    background: white;
    border-radius: 1rem;
    padding: 0.3rem;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 50px 30px -20px;
    transition: all 0.5s ease-in-out;
}

.card .image-container {
    position: relative;
    width: 100%;
    height: 130px;
    border-radius: 0.7rem;
    border-top-right-radius: 4rem;
    margin-bottom: 1rem;
}

.card .image-container img {
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    border-radius: inherit;
}

.card .image-container .svg {
    height: 100%;
    width: 100%;
    border-radius: inherit;
}

.card .image-container .price {
    position: absolute;
    right: 0.7rem;
    bottom: -1rem;
    background: white;
    color: #234A2B;
    font-weight: 900;
    font-size: 0.9rem;
    padding: 0.5rem;
    border-radius: 1rem 1rem 2rem 2rem;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 0px 15px 0px;
}

.card .favorite {
    position: absolute;
    width: 19px;
    height: 19px;
    top: 5px;
    right: 5px;
    cursor: pointer;
}

.card .favorite input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.card .favorite input:checked~svg {
    animation: bouncing 0.5s;
    fill: rgb(255, 95, 95);
    filter: drop-shadow(0px 3px 1px rgba(53, 53, 53, 0.14));
}

.card .favorite svg {
    fill: #a8a8a8;
}

.card .content {
    padding: 0px 0.8rem;
    margin-bottom: 1rem;
}

.card .content .brand {
    font-weight: 900;
    color: #a6a6a6;
}

.card .content .product-name {
    font-weight: 700;
    color: #666666;
    font-size: 0.8rem;
    margin-bottom: 1rem;
}

.card .content .color-size-container {
    display: flex;
    justify-content: space-between;
    text-transform: uppercase;
    font-size: 0.7rem;
    font-weight: 700;
    color: #a8a8a8;
    gap: 2rem;
    margin-bottom: 1.5rem;
}

.card .content .color-size-container>* {
    flex: 1;
}

.card .content .color-size-container .colors .colors-container {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.3rem;
    font-size: 0.5rem;
    margin-top: 0.2rem;
}

.card .content .color-size-container .colors .colors-container .color {
    height: 14px;
    position: relative;
}

.card .content .color-size-container .colors .colors-container .color:hover .color-name {
    display: block;
}

.card .content .color-size-container .colors .colors-container .color a {
    display: inline-block;
    height: 100%;
    aspect-ratio: 1;
    border: 3px solid black;
    border-radius: 50%;
}

.card .content .color-size-container .colors .colors-container .color .color-name {
    display: none;
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
    background: black;
    padding: 0.2rem 1rem;
    border-radius: 1rem;
    text-align: center;
}

.card .content .color-size-container .colors .colors-container .color:first-child a {
    border-color: #ffd426;
}

.card .content .color-size-container .colors .colors-container .color:nth-child(2) a {
    background: #144076;
}

.card .content .color-size-container .colors .colors-container .color:nth-child(3) a {
    border-color: #00b9ff;
}

.card .content .color-size-container .colors .colors-container .color:nth-child(4) a {
    border-color: #ff6ba1;
}

.card .content .color-size-container .colors .colors-container .active {
    border-color: black;
}

.card .content .color-size-container .sizes .size-container {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.2rem;
}

.card .content .color-size-container .sizes .size-container .size {
    height: 14px;
}

.card .content .color-size-container .sizes .size-container .size .size-radio {
    cursor: pointer;
}

.card .content .color-size-container .sizes .size-container .size .size-radio input {
    display: none;
}

.card .content .color-size-container .sizes .size-container .size .size-radio input:checked~.name {
    background: var(--accent-color);
    border-radius: 2rem 2rem 1.5rem 1.5rem;
    color: white;
}

.card .content .color-size-container .sizes .size-container .size .size-radio .name {
    display: grid;
    place-content: center;
    height: 100%;
    aspect-ratio: 1.2/1;
    text-decoration: none;
    color: #484848;
    font-size: 0.5rem;
    text-align: center;
}

.card .content .rating {
    color: #a8a8a8;
    font-size: 0.6rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.card .content .rating svg {
    height: 12px;
}

.card .button-container {
    display: flex;
    gap: 0.3rem;
}

.card .button-container .button {
    border-radius: 1.4rem 1.4rem 0.7rem 0.7rem;
    border: none;
    padding: 0.5rem 0;
    background: #234A2B;
    color: white;
    font-weight: 900;
    cursor: pointer;
}

.card .button-container .button:hover {
    background: orangered;
}

.card .button-container .buy-button {
    flex: auto;
}

.card .button-container .cart-button {
    display: grid;
    place-content: center;
    width: 50px;
}

.card .button-container .cart-button svg {
    width: 15px;
    fill: white;
}

.card:hover {
    transform: scale(1.03);
}

@keyframes bouncing {

    from,
    to {
        transform: scale(1, 1);
    }

    25% {
        transform: scale(1.5, 2.1);
    }

    50% {
        transform: scale(2.1, 1.5);
    }

    75% {
        transform: scale(1.5, 2.05);
    }
}

.button-disabled {
    background-color: #234A2B !important;
    color: #fd8888 !important;
    cursor: not-allowed !important;
}

:deep(.el-rate) {
    height: 16px !important;
}
</style>
