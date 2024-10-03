import createApiClient from "./api.service";

class MessageService {
    constructor(baseUrl = "/api/messages") {
        this.api = createApiClient(baseUrl);
    }

    async get() {
        return (await this.api.get('user/message')).data; 
    }

    async countUnRead () {
        return (await this.api.get('/count/unread')).data;
    }

    async getAll() {
        return (await this.api.get("/all")).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }  
    
    async getAllUser() {
        return (await this.api.get("/user/all")).data;
    }
}

export default new MessageService()