import { createApp } from 'vue';
import App from '/@/App.vue';
import router from '/@/routers'
import 'quill/dist/quill.snow.css'

createApp(App)
    .use(router)
    .mount('#app')
