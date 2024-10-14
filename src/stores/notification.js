import { defineStore } from "pinia";
import notificationService from "@/services/notification.service";

export const useNotificationStore = defineStore("notification", {
    state: () => ({
        notifications: [],
        length: 0,
        count_unread: 0,
    }),
    actions: {
        async getByUser() {
           const response = await notificationService.getByUser();
           console.log(response);
           this.notifications = response.data;
           this.length = response.data.length;
           this.count_unread = response.count_unread;
        },
        
         getMessageById(id) {
            return this.notifications.find(notification => notification.id === id)?.message;
        },
        
    },
});