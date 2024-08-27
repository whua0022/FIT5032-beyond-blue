<script setup>
import { currentUserStore } from '@/store';

</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
        <h1>{{currentUserStore.username }}</h1>
        <a class="navbar-brand" href="#"><img src="../assets/beyondBlueLogo.png"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
                <RouterLink class="nav-link" to="/">Home</RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink class="nav-link" to="/events">Events</RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink class="nav-link" to="/">Resources</RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink class="nav-link" to="/">Contact us</RouterLink>
            </li>
        </ul>
        <RouterLink class="nav-link" to="/login">Login</RouterLink>
        </div>
    </div>
    </nav>
</template>