import { createRouter, createWebHistory } from 'vue-router';
import Register from './components/registration.vue';
import Login from './components/login.vue'

const routes = [
  {
    path: '/',
    component: Register,
    name: Register
  },
  {
    path:'/login',
    component:Login,
    name:Login
  },
  {
    path:'/user',
    component: () => import('./components/userList.vue')
  },
  {
    path:'/chat/:userId',
    component: () => import('./components/chat.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
