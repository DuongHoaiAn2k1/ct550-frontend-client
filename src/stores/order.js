import orderService from "@/services/order.service";
import { defineStore } from "pinia";

export const useOrderStore = defineStore("order", {
    state: () => ({
        listOrder: [],
    }),
    actions: {
        async fetchListOrder() {
            try {
                const response = await orderService.getByUser();
                this.listOrder = response.data;
                console.log("List order ref store: ", response);
            } catch (error) {
                console.log(error.response);
            }
        },
    },
});
