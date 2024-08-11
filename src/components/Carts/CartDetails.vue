<template>
    <div class="mt-5 mt-lg-0">
        <div class="border shadow-none">
            <div class="card-header bg-transparent border-bottom py-3 px-4">
                <h5 class="font-size-20 mb-0">Chi tiết giỏ hàng</h5>
            </div>
            <div class="card-body p-4 pt-2">
                <div class="table-responsive">
                    <table class="table mb-0">
                        <tbody>
                            <tr>
                                <th>Tổng tiền:</th>
                                <td class="text-end">{{ formatCurrency(total) }}</td>
                            </tr>
                            <tr>
                                <th>Tổng sản phẩm :</th>
                                <td class="text-end">{{ number }}</td>
                            </tr>
                            <tr class="bg-light">
                                <th>Tổng :</th>
                                <td class="text-end">
                                    <span class="fw-bold">{{ formatCurrency(total) }}</span>
                                </td>
                            </tr>
                            <tr class="bg-light">
                                <th>Địa chỉ:</th>
                                <td class="text-end">
                                    <select name="addressToPay" :value="addressToPay"
                                        @change="updateAddress($event.target.value)" class="text-truncate">
                                        <option value="" selected disabled>
                                            --Chọn địa chỉ--
                                        </option>
                                        <option v-for="(data, index) in listAddress" :value="index" :key="index">
                                            {{ data.address }} {{ data.commue }} {{ data.district }} {{ data.city }} -
                                            {{ data.name }} - {{ data.phone }}
                                        </option>
                                    </select>
                                    <p class="text-center"><span class="text-danger">{{ addressError }}</span></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="row">
                    <button @click="$emit('redirectPayment')" class="btn mt-1 text-center"
                        style="background-color: #234A2B; color: white;">
                        MUA HÀNG
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency } from '@/helpers/UtilHelper';
const props = defineProps({
    total: Number,
    number: Number,
    listAddress: Array,
    addressToPay: {
        type: [String, Number],
        default: ""
    },
    addressError: String,
});

// Emit an event to update the addressToPay value
const updateAddress = (value) => {
    emit('update:addressToPay', value);
};
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>