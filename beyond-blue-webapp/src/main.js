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

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

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

const firebaseConfig = {
  apiKey: "AIzaSyAs3vsZcBPwiVN5sAePhAMWZVgvUu-Lq-U",
  authDomain: "beyond-blue-2c5d3.firebaseapp.com",
  projectId: "beyond-blue-2c5d3",
  storageBucket: "beyond-blue-2c5d3.appspot.com",
  messagingSenderId: "132247600551",
  appId: "1:132247600551:web:3b557470742532b6cbca82"
};
initializeApp(firebaseConfig);

createApp(App)
    .use(router)    
    .mount('#app')
