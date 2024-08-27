<script setup>
import { ref } from 'vue'

const data = ref({
  username: '',
  password: '',
  email: '',
  confirmPassword: ''
})

const errors = ref({
  username: null,
  password: null,
  email: null,
  confirmPassword: null
})
const submittedCards = ref([])

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  if (!errors.value.username && !errors.value.password && !errors.value.confirmPassword) {
    submittedCards.value.push({ ...data.value })
    clearForm()
  }
}

const clearForm = () => {
  data.value = {
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  }
}

const validateName = (blur) => {
  if (data.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = data.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (data.value.confirmPassword != data.value.password) {
    if (blur) errors.value.password = `Password must be the same`
  } else {
    errors.value.confirmPassword = null
  }
}
</script>

<template>
    <div>
      <form @submit.prevent="submitForm" class="w-100 mx-auto form-container mt-5 p-5 border">
        <div class="mb-3">
          <label for="usernameInput" class="form-label">Username</label>
          <input type="text" class="form-control" id="usernameInput"  @blur="() => validateName(true)" @input="() => validateName(false)" v-model="data.username" required>
        </div>
        <div class="mb-3">
          <label for="emailInput" class="form-label">Email address</label>
          <input type="email" class="form-control" id="emailInput" v-model="data.email" required>
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="passwordInput" class="form-label">Password</label>
          <input type="password" class="form-control" id="passwordInput" @blur="() => validatePassword(true)" @input="() => validatePassword(false)" v-model="data.password" @input="validatePassword" required>
          <div v-if="passwordError" class="text-danger">
            Password must be at least 8 characters long.
          </div>
        </div>
        <div class="mb-3">
          <label for="confirmPasswordInput" class="form-label">Password</label>
          <input type="password" class="form-control" id="confirmPasswordInput" v-model="data.confirmPassword" @input="validateConfirmPassword" required>
          <div v-if="passwordError" class="text-danger">
            Password must be at least 8 characters long.
          </div>
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-primary" :disabled="passwordError">Create account</button>
        </div>
      </form>
    </div>
  </template>

<style>
    .form-container {
        max-width: 60%;
    }
</style>