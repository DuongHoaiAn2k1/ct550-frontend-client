<template>
    <div class="row" v-show="!loading">
        <div class="col-lg-4 order-lg-1 order-2">
            <div class="container">
                <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img class="d-block w-100" :src="'http://dacsancamau.com/storage/' + img_1" />
                        </div>
                        <div class="carousel-item">
                            <img class="d-block w-100" :src="'http://dacsancamau.com/storage/' + img_2" alt="..." />
                        </div>
                        <div class="carousel-item">
                            <img class="d-block w-100" :src="'http://dacsancamau.com/storage/' + img_3" alt="..." />
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="col-lg-8 order-3">
            <div class="product_description">
                <div class="product_name">
                    {{ product.product_name }}
                </div>
                <div>
                    <span class="product_price">{{ formatCurrency(product.product_price) }}</span>
                </div>
                <p class="text-muted mb-0">
                    <el-rate v-model="averageRating" disabled show-score text-color="#ff9900"
                        score-template="{value} points" />
                </p>
                <div>
                    <span class="product_saved">Khối lượng:</span>
                    <span style="color: black">1kg</span>
                </div>
                <hr class="singleline" />
                <div>
                    <p v-for="(des, index) in productDetail" class="product_info" :key="index">
                        {{ des }}.
                    </p>
                </div>
                <div class="order_info d-flex flex-row"></div>
                <div class="row">
                    <div class="col-xs-6" style="margin-left: 13px">
                        <div class="product_quantity d-flex flex-row align-items-center mb-2">
                            <div id="" class="design-button-amount me-2" @click="decrementQuantity">
                                <i class="fa-solid fa-minus"></i>
                            </div>
                            <div class="">
                                <span>Số lượng: </span>

                                <input id="quantity_input" type="text" pattern="[0-9]*" :value="quantity" />
                            </div>

                            <div id="" class="design-button-amount ms-1" @click="incrementQuantity">
                                <i class="fa-solid fa-plus"></i>
                            </div>


                        </div>
                    </div>
                    <div class="col-xs-6">
                        <button @click="handleAddToCart(product.product_id)" type="button"
                            class="btn btn-dark shop-button me-1">
                            Thêm vào giỏ hàng
                        </button>
                        <button @click="handleBuyNow(product.product_id)" type="button" class="btn shop-button"
                            style="background-color: #234A2B; color: white;">
                            Mua ngay
                        </button>
                        <div class="product_fav" v-show="!product.liked" @click="createFavorite(product.product_id)">
                            <i class="fa-regular fa-heart"></i>
                        </div>
                        <div class="product_fav" v-show="product.liked" @click="deleteFavorite(product.product_id)">
                            <i class="fa-solid fa-heart"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { toRefs } from 'vue';

const props = defineProps({
    product: Object,
    productDetail: Array,
    averageRating: Number,
    img_1: String,
    img_2: String,
    img_3: String,
    quantity: Number,
    loading: Boolean,
});

const { product, productDetail, averageRating, img_1, img_2, img_3, quantity, loading } = toRefs(props);

const formatCurrency = (amount) => {
    return (
        amount?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        }) || ""
    );
};

const incrementQuantity = () => {
    emit('increment-quantity');
};

const decrementQuantity = () => {
    emit('decrement-quantity');
};

const handleAddToCart = (product_id) => {
    emit('add-to-cart', product_id);
};

const handleBuyNow = (product_id) => {
    emit('buy-now', product_id);
};

const createFavorite = (product_id) => {
    emit('create-favorite', product_id);
};

const deleteFavorite = (product_id) => {
    emit('delete-favorite', product_id);
};

const emit = defineEmits([
    'increment-quantity',
    'decrement-quantity',
    'add-to-cart',
    'buy-now',
    'create-favorite',
    'delete-favorite'
]);

onMounted(() => {
    console.log("Data Product Detail component: ", props);
})
</script>

<style scoped>
.design-button-amount {
    height: 20px;
}

.order_info {
    margin-top: 16px;
}

.product_description {
    padding-left: 0px;
}

.product_name {
    font-size: 24px;
    font-weight: 600;
    margin-top: 0px;
}

.product_price {
    display: inline-block;
    font-size: 30px;
    font-weight: 500;
    margin-top: 9px;
    clear: left;
}

.product_saved {
    display: inline-block;
    font-size: 15px;
    font-weight: 200;
    color: #999999;
    clear: left;
}

.singleline {
    margin-top: 1rem;
    margin-bottom: 0.4rem;
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.product_quantity {
    width: 180px;
    height: 50px;
    border: solid 1px #e5e5e5;
    border-radius: 5px;
    overflow: hidden;
    padding-left: 25px;
    float: left;
    margin-right: 30px;
}

.product_quantity span {
    display: block;
    height: 50px;
    font-size: 16px;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.5);
    line-height: 50px;
    float: left;
}

.product_quantity input {
    display: block;
    width: 30px;
    height: 50px;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.5);
    text-align: left;
    padding-left: 9px;
    line-height: 50px;
    float: left;
}

.quantity_buttons {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 29px;
    border-left: solid 1px #e5e5e5;
}


.quantity_control i {
    font-size: 11px;
    color: rgba(0, 0, 0, 0.3);
    pointer-events: none;
}

.quantity_control:active {
    border: solid 1px rgba(14, 140, 228, 0.2);
}


.shop-button {
    height: 47px;
}

.product_fav i {
    line-height: 44px;
    color: #eb1919;
    font-size: 20px;
}

.product_fav {
    display: inline-block;
    width: 52px;
    height: 46px;
    background: #ffffff;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
    border-radius: 11%;
    text-align: center;
    cursor: pointer;
    margin-left: 3px;
    -webkit-transition: all 200ms ease;
    -moz-transition: all 200ms ease;
    -ms-transition: all 200ms ease;
    -o-transition: all 200ms ease;
    transition: all 200ms ease;
}

@media (max-width: 390px) {
    .product_fav {
        display: none;
    }
}
</style>
