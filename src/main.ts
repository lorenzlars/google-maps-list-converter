import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import { createPinia } from "pinia";

import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css"

const pinia = createPinia()
const app = createApp(App);

app.use(pinia).use(PrimeVue).mount('#app')
