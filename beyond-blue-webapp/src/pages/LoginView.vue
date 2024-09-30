<script setup>
import { currentUserStore } from '@/store';
import { useRouter } from 'vue-router';
import {ref} from 'vue'
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"

const data = ref({
    email: '',
    password: ''
})

const errors = ref({
    loginError: null
})
const router = useRouter()
const login = () => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, data.value.email, data.value.password)
        .then(() => {
            window.alert("Login success")
            currentUserStore.setCurrentUser(data.value.email)
            router.push("/")
        }).catch(err => {
            data.value = {
                email: '',
                password: ''
            }
            errors.value.loginError = true
        }).then(() => {
            currentUserStore.validateRole()
        })
}
</script>
<template>
    <div>
        <form @submit.prevent="login" class="w-100 mx-auto form-container mt-5 p-5 border">
            <div v-if="errors.loginError" class="text-danger">Incorrect details</div>
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