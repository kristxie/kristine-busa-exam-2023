import {createRouter, createWebHistory} from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import Login from '@/views/Login.vue';
import Songs from '@/views/Songs.vue';
import Albums from '@/views/Albums.vue';
import About from '@/views/About.vue';

const router = createRouter({
    history: createWebHistory(),
    routes : [
        {
            path: '/login',
            component: Login,
          },
          {
            path: '/',
            component: Songs,
          },
          {
            path: '/albums',
            component: Albums,
          },
          {
            path: '/about',
            component: About,
          },
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
  
    if (!authStore.authenticated) {
        if (to.path !== '/login') {
            router.push('/login');
        } else {
            next();
        }
    } else {
        if (to.path === '/login') {
            next('/');
        } else {
            next();
        }
    }
});

export default router
