<script setup>
import { ref } from 'vue'
import { formatDate } from '@/lib'
import { currentUserStore } from '@/store';
let eventList = [
  { id: 1, title: "Event 1", description: "Description for event 1", location: "1 Test street, Melbourne, 3000", date: new Date(2024, 8, 1), ratings:[{username: "Test user 1", score: 3, review: "Good fun"}]},
  { id: 2, title: "Event 2", description: "Description for event 2", location: "2 Test street, Melbourne, 3000", date: new Date(2024, 10, 1), ratings:[{username: "Test user 1", score: 5, review: "The best"}, {username: "Test user 2", score: 4, review: "Awesome"}]},
]

const selectedEvent = ref(null)

// Creates a new modal for the event chosen
const viewDetails = (event) => {
  selectedEvent.value = event
  new bootstrap.Modal(document.getElementById('eventModal')).show()
}
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
          <div class="list-group">
            <div v-for="event in eventList" :key="event.id" class="list-group-item mb-3">
              <h5 class="mb-1">{{ event.title }}</h5>
              <p class="mb-1">{{ event.description }}</p>
              <button @click="viewDetails(event)" class="btn btn-primary">View Details</button>
            </div>
          </div>
        </div>
  
        <div class="col-md-8">
          <div class="empty-box h-100 border">
            <h1>Map goes here</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="eventModal" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventModalLabel">{{ selectedEvent?.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>Description:</strong> {{ selectedEvent?.description }}</p>
            <p><strong>Date:</strong> {{ formatDate(selectedEvent?.date) }}</p>
            <p><strong>Location:</strong> {{ selectedEvent?.location }}</p>
            <p><strong>Reviews</strong></p>
            <ul>
              <li v-for="rating in selectedEvent?.ratings" :key="rating.username">
                <strong>{{ rating.username }}</strong> 
                <span>{{ rating.score }}/5</span>
                <p><strong>Reviews</strong></p>
                <p>{{ rating.review }}</p>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </template>

<style>
.empty-box {
    background-color: #f8f9fa;
}
</style>