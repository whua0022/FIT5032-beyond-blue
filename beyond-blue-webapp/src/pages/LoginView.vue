<script setup>
import { currentUserStore } from '@/store';
import { useRouter } from 'vue-router';
import {ref} from 'vue'
import CryptoJS from 'crypto-js'

const data = ref({
    email: '',
    password: ''
})


const router = useRouter()

// Find a valid account
const users = JSON.parse(localStorage.getItem("users"))
const login = () => {
    users.forEach(user => {
        if (user.email == data.value.email && user.password == CryptoJS.SHA256(data.value.password).toString(CryptoJS.enc.Hex)) {
            currentUserStore.setCurrentUser(user.username, user.email, user.isAdmin, user.createdEvents, user.bookedEvents)
        }
    })
    router.push('/')
}

</script>
<template>
    <div>
        <form @submit.prevent="login" class="w-100 mx-auto form-container mt-5 p-5 border">
            <div class="mb-3">
                <label for="emailInput" class="form-label">Email address</label>
                <input type="email" class="form-control" id="emailInput" aria-describedby="EmailHelp" v-model="data.email">
            </div>
            <div class="mb-3">
                <label for="passwordInput" class="form-label">Password</label>
                <input type="password" class="form-control" id="passwordInput" v-model="data.password">
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-primary" >Login</button>
            </div>
            <div class="text-center mt-3">
                <span>Or </span>
                <RouterLink to="/register" class="text-primary">Create an account</RouterLink>
            </div>
        </form>
    </div>
</template>

<style>
    .form-container {
        max-width: 60%;
    }
</style>