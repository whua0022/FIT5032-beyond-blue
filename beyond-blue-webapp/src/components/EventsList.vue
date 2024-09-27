<script setup>
import { onMounted, ref } from 'vue'
import db from '../firebase/init';
import { collection, query, getDocs } from "firebase/firestore";
import { currentUserStore } from '@/store';
const eventsList = ref([])

const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "events")))
    let tempList = []
    querySnapshot.forEach((event) => {
      tempList.push({ id: event.id, ...event.data() })
    })
    console.log("Fetched events:", tempList)
    eventsList.value = tempList
  } catch (error) {
    console.error("Error fetching events:", error)
  }
}

onMounted(() => {
  fetchEvents()
})

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

const displayAverageRating = (event) => {
  if (!event.reviews || event.reviews.length === 0) return 0
  let score = 0
  event.reviews.forEach(review => {
    score += review.rating
  })
  return Math.floor(score / event.reviews.length)
}

</script>

<template>
  <div class="list-group">
    <div v-for="event in eventsList" :key="event.id" class="list-group-item mb-3">
      <div>
        <span class="badge bg-primary rounded-pill">{{ displayAverageRating(event) }}/5</span>
      </div>
      <div>
        <h5 class="mb-1">{{ event.title }}</h5>
      </div>
      <p class="mb-1">{{ event.description }}</p>
      <button @click="viewDetails(event)" class="btn btn-primary">View Details</button>
    </div>
  </div>
  <div class="modal fade" id="eventModal" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventModalLabel">{{ selectedEvent?.title }}</h5>
            <div v-if="currentUserStore.email != null" class="ms-auto">
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