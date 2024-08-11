<template>

    <div class="col-lg-2 col-md-4 col-sm-6 mb-4">
        <div class="category-item">
            <img :src="image" alt="Introduction" class="img-fluid">
            <h2 class="title">{{ title }}</h2>
            <button @click="$router.push({ name: 'product', params: { id: categoryId } })"
                class="btn btn-outline-success button-css">{{ AcctionDetail }}</button>
        </div>
    </div>

</template>

<script setup>

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    AcctionDetail: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    categoryId: {
        type: Number,
        required: true
    }

});

</script>

<style scoped>
.title {
    font-weight: 600;
    color: white !important;
}

.category-item {
    background-color: #758652;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.category-item:hover {
    transform: translateY(-10px);
}

.category-item img {
    max-width: 40%;
    height: auto;
    border-radius: 50%;
}

.category-item h2 {
    font-size: 1rem;
    color: #333;
    margin: 15px 0;
}

.category-item .btn {
    font-size: 1rem;
    padding: 5px 10px;
}

.button-css {
    font-weight: 600;
    color: white;
}
</style>