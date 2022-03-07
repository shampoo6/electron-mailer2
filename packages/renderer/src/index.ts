import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/routers';
import 'quill/dist/quill.snow.css';
import 'ant-design-vue/dist/antd.min.css';
import {initCheckUpdate} from './message/checkUpdate';

initCheckUpdate();

createApp(App)
  .use(router)
  .mount('#app');
