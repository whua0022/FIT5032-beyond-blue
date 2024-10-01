<script setup>
import { currentUserStore } from '@/store';
import { getAuth, signOut } from 'firebase/auth';

// Get the Firebase authentication instance
const auth = getAuth();

// Function to handle logout
const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
    currentUserStore.email = null;
    currentUserStore.isAdmin = false;
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary" aria-label="Main Navigation">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="../assets/beyondBlueLogo.png" alt="Beyond Blue Logo" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" role="menu">
          <li class="nav-item" role="menuitem">
            <RouterLink class="nav-link" to="/" aria-label="Go to Home page">Home</RouterLink>
          </li>
          <li class="nav-item" role="menuitem">
            <RouterLink class="nav-link" to="/events" aria-label="Go to Events page">Events</RouterLink>
          </li>
          <li class="nav-item" role="menuitem">
            <RouterLink class="nav-link" to="/" aria-label="Go to Resources page">Resources</RouterLink>
          </li>
          <li class="nav-item" role="menuitem">
            <RouterLink class="nav-link" to="/" aria-label="Go to Contact Us page">Contact us</RouterLink>
          </li>
          <li v-if="currentUserStore.isAdmin" class="nav-item" role="menuitem">
            <RouterLink class="nav-link" to="/admin" aria-label="Go to Admin page">Admin</RouterLink>
          </li>
        </ul>
        <div v-if="currentUserStore.email" aria-label="User account information">
          <p>{{ currentUserStore.email }} || {{ currentUserStore.isAdmin ? 'Admin' : 'User' }}</p>
          <button class="btn btn-danger" @click="logout" aria-label="Logout from account">
            Logout
          </button>
        </div>
        <div v-else>
          <RouterLink class="nav-link" to="/login" aria-label="Login to your account">Login</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>