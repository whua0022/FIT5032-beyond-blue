<script setup>
import db from '@/firebase/init'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { onMounted, ref, computed } from 'vue'
import sgMail from '@sendgrid/mail'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

sgMail.setApiKey(import.meta.env.VITE_SENDGRID_KEY)

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const eventsList = ref([])
const selectedTab = ref('averageRating')
const chartRef = ref(null)
const eventToEdit = ref(null)
const newTitle = ref('')
const newDetails = ref('')

const fetchEvents = async () => {
  const auth = getAuth()

  try {
    const res = await getDocs(query(collection(db, 'events'), where('creatorId', '==', auth.currentUser.uid)))
    eventsList.value = res.docs.map((val) => ({ id: val.id, ...val.data() }))
    generateChart()
  } catch (err) {
    console.error(err)
  }
}

const averageRatings = computed(() => {
  return eventsList.value.map((event) => {
    if (event.reviews && event.reviews.length > 0) {
      const average = event.reviews.reduce((sum, review) => sum + review.rating, 0) / event.reviews.length
      return { title: event.title, averageRating: average.toFixed(1) }
    }
    return { title: event.title, averageRating: 0 }
  })
})

const generateChart = () => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d')
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: averageRatings.value.map(event => event.title),
        datasets: [{
          label: 'Average Rating of each event',
          data: averageRatings.value.map(event => event.averageRating),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 5
          }
        }
      }
    })
  }
}

const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, 'events', eventId))
    eventsList.value = eventsList.value.filter(event => event.id !== eventId)
    alert('Event deleted successfully')
  } catch (err) {
    console.error(err)
    alert('Failed to delete event')
  }
}

const selectEventForEdit = (event) => {
  eventToEdit.value = event
  newTitle.value = event.title
  newDetails.value = event.details
}

const updateEvent = async () => {
  if (!eventToEdit.value) return

  try {
    const eventRef = doc(db, 'events', eventToEdit.value.id)
    await updateDoc(eventRef, {
      title: newTitle.value,
      details: newDetails.value
    })

    const eventIndex = eventsList.value.findIndex(event => event.id == eventToEdit.value.id)
    eventsList.value[eventIndex].title = newTitle.value
    eventsList.value[eventIndex].details = newDetails.value

    alert('Event updated successfully')
    eventToEdit.value = null

    const editModal = document.getElementById('editEventModal')
    const modalInstance = bootstrap.Modal.getInstance(editModal)
    modalInstance.hide()
  } catch (err) {
    console.error(err)
    alert('Failed to update event')
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <div class="container">
    <h1>Manage my events</h1>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: selectedTab == 'averageRating' }" @click="selectedTab = 'averageRating'">Average Ratings</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: selectedTab == 'allReviews' }" @click="selectedTab = 'allReviews'">All Reviews</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: selectedTab == 'deleteEvent' }" @click="selectedTab = 'deleteEvent'">Delete Event</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: selectedTab == 'modifyEvent' }" @click="selectedTab = 'modifyEvent'">Modify Event</a>
      </li>
    </ul>

    <div v-if="selectedTab == 'averageRating'" class="mt-4">
      <canvas ref="chartRef" id="averageRatingsChart" width="400" height="200"></canvas>
    </div>

    <div v-if="selectedTab == 'allReviews'" class="mt-4">
      <div v-for="event in eventsList" :key="event.id" class="mb-4">
        <h3>{{ event.title }}</h3>
        <ul class="list-group">
          <li v-for="review in event.reviews" :key="review.comment" class="list-group-item">
            <strong>{{ review.username }}:</strong> {{ review.comment }} (Rating: {{ review.rating }} /5)
          </li>
        </ul>
      </div>
    </div>

    <div v-if="selectedTab == 'deleteEvent'" class="mt-4">
      <h3>Select an Event to Delete</h3>
      <ul class="list-group">
        <li v-for="event in eventsList" :key="event.id" class="list-group-item d-flex justify-content-between align-items-center">
          {{ event.title }}
          <button class="btn btn-danger" @click="deleteEvent(event.id)">Delete</button>
        </li>
      </ul>
    </div>

    <div v-if="selectedTab == 'modifyEvent'" class="mt-4">
      <h3>Select an Event to Modify</h3>
      <ul class="list-group mb-4">
        <li v-for="event in eventsList" :key="event.id" class="list-group-item d-flex justify-content-between align-items-center">
          {{ event.title }}
          <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editEventModal" @click="selectEventForEdit(event)">Edit</button>
        </li>
      </ul>
    </div>

    <div class="modal fade" id="editEventModal" tabindex="-1" aria-labelledby="editEventModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editEventModalLabel">Edit Event</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input v-model="newTitle" class="form-control" type="text" />
            </div>
            <div class="mb-3">
              <label class="form-label">Details</label>
              <textarea v-model="newDetails" class="form-control"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" @click="updateEvent">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .nav-link {
    cursor: pointer
  }
  canvas {
    max-width: 100%
  }
</style>
