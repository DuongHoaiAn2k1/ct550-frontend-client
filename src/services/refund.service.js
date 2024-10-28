import createApiClient from "./api.service";

class RefundService {
    constructor(baseUrl = "/api/refund") {
        this.api = createApiClient(baseUrl);
    }

   async  create(data) {
        return (await this.api.post("/", data)).data;
    }
    
    async getByUser() {
        return (await this.api.get("/get-by-user")).data
    }
}

export default new RefundService();