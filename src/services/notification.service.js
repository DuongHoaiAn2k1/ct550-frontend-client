import createApiClient from "./api.service";

class NotificationService {
    constructor(baseUrl = "/api/notification") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data
    }
    async create(data) {
        return (await this.api.post("/",data)).data;
    }

    async getByUser() {
        return (await this.api.get("/user")).data
    }

    async userReadAll() {
        return (await this.api.post("/user/read/all")).data
    }
}

export default new NotificationService()