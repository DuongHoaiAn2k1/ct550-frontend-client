import axios from 'axios';

class SearchService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: 'http://103.188.82.134:8001/api',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async search(query) {
        try {
            const response = await this.apiClient.post('/search', {
                query: query
            });
            return response;
        } catch (error) {
            console.error('Error fetching search data:', error);
            throw error; 
        }
    }
}

export default new SearchService();
