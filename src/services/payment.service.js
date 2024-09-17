import createApiClient from "./api.service";

class PaymentService {
    constructor(baseUrl = "/api/payment") {
        this.api = createApiClient(baseUrl);
    }

    async createPayment(data) {
        return (await this.api.post("/vnpay-payment", data)).data;
        // console.log("Payment Data: ", data);
    }

    async paymentCheckout(data) {
        return (await this.api.post("/vnpay-return", data)).data;
        // console.log("Payment Data: ", data);
    }
}

export default new PaymentService();