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
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import AdminView from './pages/AdminView.vue';
import SendNotificationsView from './pages/SendNotificationsView.vue';
import ManageEventsView from './pages/ManageEventsView.vue';

export const routes = [
    {path: "/", component: HomeView},
    {path: "/login", component: LoginView},
    {path: "/register", component: RegisterAccView},
    {path: "/events", component: EventsView},
    {path: "/events/create", component: CreateEventView},
    {path: "/events/rate", name: "AddRatingView", component: AddRatingView},
    {path: "/admin", component: AdminView},
    {path: "/events/notifications", component: SendNotificationsView},
    {path: "/events/manage", component: ManageEventsView},
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes
})


createApp(App)
    .use(router)    
    .component("EasyDataTable", Vue3EasyDataTable)
    .mount('#app')