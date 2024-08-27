<script setup>
import { currentUserStore } from '@/store';
import { useRouter } from 'vue-router';

const router = useRouter()

//TODO: Fix this implementation later
const login = (email) => {
    currentUserStore.username = "TestUsername111"
    currentUserStore.email = email
    currentUserStore.isAdmin = true
    
    router.push('/')
}

</script>
<template>
    <div>
        <form @submit="login" class="w-100 mx-auto form-container mt-5 p-5 border">
            <div class="mb-3">
                <label for="emailInput" class="form-label">Email address</label>
                <input type="email" class="form-control" id="emailInput" aria-describedby="EmailHelp">
            </div>
            <div class="mb-3">
                <label for="passwordInput" class="form-label">Password</label>
                <input type="password" class="form-control" id="passwordInput">
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-primary" >Login</button>
            </div>
            <div class="text-center mt-3">
                <span>Or </span>
                <router-link to="/register" class="text-primary">Create an account</router-link>
            </div>
        </form>
    </div>
</template>

<style>
    .form-container {
        max-width: 60%;
    }
</style>