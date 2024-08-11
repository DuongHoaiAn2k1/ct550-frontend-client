<template>
    <div class="row">
        <div class="text-center">
            <div class="v-spinner" v-show="loading">
                <div class="v-pulse v-pulse1" :style="[spinnerStyle, spinnerDelay1]"></div>
                <div class="v-pulse v-pulse2" :style="[spinnerStyle, spinnerDelay2]"></div>
                <div class="v-pulse v-pulse3" :style="[spinnerStyle, spinnerDelay3]"></div>
            </div>
        </div>
    </div>
</template>

<script setup>

// Props to receive from parent
const props = defineProps({
    loading: {
        type: Boolean,
        required: true,
    },
    spinnerStyle: {
        type: Object,
        required: true,
    },
    spinnerDelay1: {
        type: Object,
        required: true,
    },
    spinnerDelay2: {
        type: Object,
        required: true,
    },
    spinnerDelay3: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped></style>