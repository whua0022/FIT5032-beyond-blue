<script setup>
import EventsList from '@/components/EventsList.vue';

</script>


<template>
    <div class="container-fluid">
      <div class="row">
        <!-- Event list column -->
        <div class="col-md-4">
          <h1>Events page</h1>
          <div v-if="currentUserStore?.isAdmin" class="mb-3">
            <RouterLink class="btn btn-success" to="/events/create">Create event</RouterLink>
          </div>
          <EventsList></EventsList>
        </div>
  
        <div class="col-md-8">
          <div class="empty-box h-100 border">
            <h1>Map goes here</h1>
          </div>
        </div>
      </div>
    </div>
  </template>

