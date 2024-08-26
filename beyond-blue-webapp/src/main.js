import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from './pages/HomeView.vue';
import LoginView from './pages/LoginView.vue';
import RegisterAccView from './pages/RegisterAccView.vue';

export const routes = [
    {path: "/", component: HomeView},
    {path: "/login", component: LoginView},
    {path: "/register", component: RegisterAccView}
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes
})

createApp(App)
    .use(router)    
    .mount('#app')
