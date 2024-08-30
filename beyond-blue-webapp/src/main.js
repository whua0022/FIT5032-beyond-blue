import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from './pages/HomeView.vue';
import LoginView from './pages/LoginView.vue';
import RegisterAccView from './pages/RegisterAccView.vue';
import EventsView from './pages/EventsView.vue';
import CreateEventView from './pages/CreateEventView.vue';
import AddRatingView from './pages/AddRatingView.vue';

export const routes = [
    {path: "/", component: HomeView},
    {path: "/login", component: LoginView},
    {path: "/register", component: RegisterAccView},
    {path: "/events", component: EventsView},
    {path: "/events/create", component: CreateEventView},
    {path: "/events/rate", name: "AddRatingView", component: AddRatingView}
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes
})

createApp(App)
    .use(router)    
    .mount('#app')
