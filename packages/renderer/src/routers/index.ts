import {createRouter, createWebHashHistory} from 'vue-router';
import Home from '/@/pages/Home.vue';
import Help from '../pages/Help.vue';
import Template from '/@/pages/Template/Index.vue';
import AppUpdate from '/@/pages/AppUpdate.vue';

import event from '/@/utils/event';

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        component: Help,
        meta: {title: '用户手册'}
      },
      {
        path: 'help',
        redirect: '/'
      },
      {
        path: 'setting',
        meta: {title: '设置'},
        component: () => import('/@/pages/Setting.vue')
      },
      {
        path: 'template',
        component: Template,
        children: [
          {
            path: 'templates',
            meta: {title: '模板管理'},
            component: () => import('/@/pages/Template/Template.vue')
          },
          {
            path: 'edit/:id',
            meta: {title: '模板编辑'},
            component: () => import('/@/pages/Template/EditTemplate.vue')
          }
        ]
      },
      {
        path: 'send',
        meta: {title: '发送邮件'},
        component: () => import('/@/pages/Send.vue')
      },
      {
        path: 'task',
        meta: {title: '任务管理'},
        component: () => import('/@/pages/Task/Index.vue')
      },
    ]
  },
  {
    path: '/app-update',
    component: AppUpdate
  }
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.afterEach((to, from) => {
  event.notify('afterRouteEnter', to.meta ? to.meta.title : '');
});

export default router;
