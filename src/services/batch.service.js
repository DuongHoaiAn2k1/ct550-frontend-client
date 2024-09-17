import createApiClient from "./api.service";

class BatchService {
    constructor(baseUrl = "/api/batches") {
        this.api = createApiClient(baseUrl);
    }

    async  getAll() {
        return (await this.api.get("/")).data
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data
    }

    async create(data) {
        return (await this.api.post("/", data)).data
    }

    async update(id, data) {
        return (await this.api.patch(`/${id}`, data)).data
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data
    }

    async reduceStock (data){
        return (await this.api.post('/reduce/product', data)).data
    }

    async checkStockAvailability (data){
        return (await this.api.post('/check/product', data)).data
    }
}

export default new BatchService()