import createApiClient from "./api.service";

class RefundService {
    constructor(baseUrl = "/api/refund") {
        this.api = createApiClient(baseUrl);
    }

    create(data) {
        return this.api.post("/", data);
    }
    
    
}

export default new RefundService();