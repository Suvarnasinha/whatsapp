import { createRouter, createWebHistory } from 'vue-router';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import Dashboard from '../components/Dashboard.vue';
import UserList from '../components/UserList.vue';
import Chat from '../components/Chat.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/dashboard', component: Dashboard },
  { path: '/users', component: UserList },
  { path: '/chat/:id', component: Chat } // Route for chat component
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
