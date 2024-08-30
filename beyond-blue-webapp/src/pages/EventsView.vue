<script setup>
import { ref } from 'vue'
import { formatDate } from '@/lib'
import { currentUserStore } from '@/store'

let eventList = JSON.parse(localStorage.getItem("events"))

const selectedEvent = ref(null)

// Creates a new modal for the event chosen
const viewDetails = (event) => {
  selectedEvent.value = event
  new bootstrap.Modal(document.getElementById('eventModal')).show()
}

const hideModal = () => {
  const modalElement = document.getElementById('eventModal')
  const modal = bootstrap.Modal.getInstance(modalElement)
  modal.hide()
}
const bookEvent = () => {
 
}

const unbookEvent = () => {
  //TODO: Fix
}

const displayAverageRating = (event) => {
  let score = 0
  event.reviews.forEach(review => {
    score += review.rating
  });
  return Math.floor(score/event.reviews.length)
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
              <div>
                <!-- <h5 class="mb-1">{{ event.title + " (BOOKED)" }}</h5> -->
                <span class="badge bg-primary rounded-pill">{{ displayAverageRating(event) }}/5</span>
              </div>
              <div>
                <h5 class="mb-1">{{ event.title }}</h5>
              </div>
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
            <div v-if="currentUserStore.username != null" class="ms-auto">
              <RouterLink class="btn btn-primary" :to="{name: 'AddRatingView', query:{eventId: selectedEvent?.id, eventTitle: selectedEvent?.title}}" @click="hideModal">Rate</RouterLink>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>Description:</strong> {{ selectedEvent?.description }}</p>
            <p><strong>Date:</strong> {{ selectedEvent?.date }}</p>
            <p><strong>Location:</strong> {{ selectedEvent?.location }}</p>
            <p><strong>Reviews</strong></p>
            <ul class="list-group">
              <li v-for="review in selectedEvent?.reviews" :key="review.username" class="list-group-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                  <strong>{{ review.username }}</strong>
                  <span class="badge bg-primary rounded-pill">{{ review.rating }}/5</span>
                </div>
                <p class="mb-1">{{ review.review }}</p>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <div>
              <!-- <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="unbookEvent(selectedEvent)">Unbook</button> -->
            </div>
            <div>
              <!-- <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="bookEvent(selectedEvent)">Book</button> -->
            </div>
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