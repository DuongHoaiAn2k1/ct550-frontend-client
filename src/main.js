import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import PrimeVue from 'primevue/config';
import Card from 'primevue/card';
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
const pinia = createPinia();

const app = createApp(App);
app.use(pinia).use(router).use(ElementPlus).use(PrimeVue);
app.component('Card', Card);
app.mount("#app");
