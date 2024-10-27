<template>
    <div class="container bootstrap snippets bootdey">
        <!-- Review Form -->
        <div v-show="!isReviewProduct && isBuyingProduct" class="row mt-2">
            <div class="col-3"></div>
            <div class="col-6">
                <h2>Cho chúng tôi xin đánh giá về sản phẩm</h2>
                <div class="mb-3">
                    <el-rate v-model="rateComment" />
                </div>
                <div class="mb-3">
                    <label for="comment">Đánh giá:</label>
                    <textarea class="form-control" id="comment" rows="3" v-model="commentValue"></textarea>
                </div>
                <button @click="handleComment" class="btn btn-dark">Đánh giá</button>
            </div>
            <div class="col-3"></div>
        </div>

        <div v-show="editReview" class="row mt-2">
            <div class="col-3"></div>
            <div class="col-6">
                <h2>Cho chúng tôi xin đánh giá về sản phẩm</h2>
                <div class="mb-3">
                    <el-rate v-model="currentReviewEdit.rating" />
                </div>
                <div class="mb-3">
                    <label for="comment">Đánh giá:</label>
                    <textarea class="form-control" id="comment" rows="3" v-model="currentReviewEdit.comment"></textarea>
                </div>
                <button @click="handleUpdateComment" class="btn btn-dark">Đánh giá</button>
            </div>
            <div class="col-3"></div>
        </div>

        <!-- Reviews List -->
        <div v-show="dataReviewByProductLength !== 0" class="row mt-2">
            <div class="panel panel-default widget">
                <div class="panel-heading">
                    <span class="glyphicon glyphicon-comment"></span>
                    <h3 class="panel-title">Các phản hồi của khách hàng</h3>
                </div>
                <div class="panel-body">
                    <ul class="list-group" v-for="data in listCommentPagination" :key="data.review_id">
                        <li class="list-group-item">
                            <div class="row">
                                <div class="col-xs-10 col-md-11 ">
                                    <div>
                                        <a class="text-primary fw-bold">
                                            {{ data.user.name }}
                                            <el-rate :model-value="data.rating" allow-half disabled />
                                            <el-button @click="handleShowEditReview(data)"
                                                v-show="data.user.id == userId" type="default" :icon="Edit" circle />
                                        </a>
                                        <div class="mic-info">Thời gian: {{ convertTime(data.created_at) }}</div>
                                    </div>
                                    <div class="comment-text">{{ data.comment }}</div>
                                </div>
                                <div v-show="data.reply != null" class="ms-3 col-xs-10 col-md-11"
                                    style="border: 1px #ddd solid ;">
                                    <div>
                                        <a class="text-primary fw-bold">
                                            Cửa hàng <i class="fa-solid fa-shop"></i>
                                        </a>
                                        <div class="mic-info">Thời gian: {{ convertTime(data.updated_at) }}</div>
                                    </div>
                                    <div class="comment-text">{{ data.reply }}</div>
                                </div>
                            </div>
                        </li>

                    </ul>
                    <div class="text-end">
                        <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small
                            background layout="prev, pager, next"
                            :total="Math.ceil(dataReviewByProductLength / pageSize) * 10" class="mt-4" />
                    </div>
                </div>
            </div>
        </div>
        <div v-show="dataReviewByProductLength === 0">
            <p class="text-center text-muted mt-5">Không có đánh giá nào</p>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import reviewService from "@/services/review.service";
import { showSuccess } from "@/helpers/NotificationHelper";
import { showSuccessMessage } from "@/helpers/NotificationHelper";
import { convertTime } from "@/helpers/UtilHelper";
import { initializeEcho } from "../../pusher/echoConfig";
import {
    Edit,
} from '@element-plus/icons-vue'
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const userId = computed(() => authStore.user_id);
const echoInstance = initializeEcho();

echoInstance.channel('user-channel')
    .listen('.review.reply-comment', (event) => {
        fetchReviewByProduct();
    });
// Define props
const props = defineProps({
    isReviewProduct: {
        type: Boolean,
        required: true
    },
    isBuyingProduct: {
        type: Boolean,
        required: true
    },
    productId: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(["checkUserReviewProduct", "checkBuyingProduct", "fetchProduct"]);

const editReview = ref(false);
const rateComment = ref();
const commentValue = ref("");
const listCommentReview = ref([]);
const dataReviewByProductLength = ref(0);
const currentPage = ref(1);
const pageSize = 6;
const currentReviewEdit = ref({
    review_id: 0,
    rating: 0,
    comment: "",
});
const fetchReviewByProduct = async () => {
    try {
        const response = await reviewService.getByProduct(props.productId);
        listCommentReview.value = response.data;
        dataReviewByProductLength.value = response.length || 0;
        console.log("Fetch review by product: ", response);
    } catch (error) {
        console.log(error.response);
    }
};

const listCommentPagination = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return listCommentReview.value?.slice(startIndex, startIndex + pageSize);
});

const handleComment = () => {
    createComment(props.productId, rateComment.value, commentValue.value).then(() => {
        fetchReviewByProduct();
        showSuccess("Cảm ơn bạn đã đánh giá");
        emit("checkUserReviewProduct");
        emit("checkBuyingProduct");
        emit("fetchProduct");
    });

};

const createComment = async (productId, rating, comment) => {
    try {
        const response = await reviewService.create({
            product_id: productId,
            rating: rating,
            comment: comment,
        });
        // console.log(response);
        // console.log("Create comment: ", productId, rating, comment);
        return response
    } catch (error) {
        console.log(error.response);
        throw error
    }
};

const handleShowEditReview = (data) => {
    editReview.value = !editReview.value;
    currentReviewEdit.value.review_id = data.review_id;
    currentReviewEdit.value.rating = data.rating;
    currentReviewEdit.value.comment = data.comment;
}

const handleUpdateComment = async () => {
    try {

        const response = await reviewService.update(currentReviewEdit.value.review_id, {
            rating: currentReviewEdit.value.rating,
            comment: currentReviewEdit.value.comment
        });

        showSuccessMessage("Cập nhật thành công");
        fetchReviewByProduct();
        emit("fetchProduct");
        editReview.value = false;
        // console.log(response);
        // console.log("Update comment: ", currentReviewEdit.value.review_id, currentReviewEdit.value.rating, currentReviewEdit.value.comment);
        return response
    } catch (error) {
        console.log(error.response);
        throw error
    }
};


onMounted(() => {
    fetchReviewByProduct();
});

const handleCurrentChange = (val) => {
    currentPage.value = val;
    console.log(`current page: ${val}`);
};
</script>

<style scoped>
:deep(.el-pagination .el-pager .is-active) {
    background-color: black !important;
}

.mic-info {
    color: #999;
    font-size: 12px;
}
</style>