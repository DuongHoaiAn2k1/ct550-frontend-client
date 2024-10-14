import createApiClient from "./api.service"

class AffiliateService {
    constructor(baseUrl = "/api/affiliate") {
        this.api = createApiClient(baseUrl);
    }

    async create(data){
        return (await this.api.post("request/create", data)).data;
    }     

    async getAll(){
        return (await this.api.get("request/list")).data;
    }

    async checkStatus(){
        return (await this.api.get("request/status/check")).data;
    }

    async getListCommission(){
        return (await this.api.get("commission/list")).data;
    }

    async generateLink(productId){
        return (await this.api.post(`link/generate/${productId}`)).data;
    }
    async getByUser(){
        return (await this.api.get("link/get-by-user")).data
    }

    async createSale(data){
        return (await this.api.post("sale/create",data)).data
    }

    async getSale(){
        return (await this.api.get("sale/get-by-user")).data
    }

    async getBalance(){
        return (await this.api.get("wallet/get-balance")).data
    }

    async createWithdraw(data){
        return (await this.api.post("withdrawal/create",data)).data
    }

    async getWithdraw(){
        return (await this.api.get("withdrawal/get-by-user")).data
    }
    async deleteWithdraw(id){
        return (await this.api.delete(`withdrawal/delete/${id}`)).data
    }
}

export default new AffiliateService()