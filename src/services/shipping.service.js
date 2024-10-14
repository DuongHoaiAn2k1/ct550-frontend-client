import createApiClient from "./api.service";

class ShippingService {
    constructor(baseUrl = "/api/shipping") {
        this.api = createApiClient(baseUrl);
        
        this.defaultParams = {
            pick_province: "Cần Thơ",
            pick_district: "Ninh Kiều",
            transport: "road",
            deliver_option: "none"
        };
    }

    async getFee(data) {
        const params = { ...this.defaultParams, ...data };
        return (await this.api.get("/", { params })).data;
    }
}

export default new ShippingService();
