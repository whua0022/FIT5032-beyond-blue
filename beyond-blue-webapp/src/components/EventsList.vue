<script setup>
import { ref, onMounted } from 'vue';
import db from '../firebase/init';
import { collection, query, getDocs } from 'firebase/firestore';
import EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import { convertToDate } from '@/lib';
// Reactive variable for events list
const items = ref([]);

// Define columns for the DataTable
const headers = [
  { value: 'title', text: 'Title'},
  { value: 'details', text: 'Details'},
  { value: 'date', text: 'Date', sortable: true },
  { value: 'address', text: "Address"},
  { value: 'averageRating', text: 'Average Rating', sortable: true },
];

// Function to calculate average rating for an event
const displayAverageRating = (event) => {
  if (!event.reviews || event.reviews.length === 0) return "No ratings";
  let score = 0;
  event.reviews.forEach((review) => {
    score += review.rating;
  });
  return Math.floor(score / event.reviews.length);
};

// Fetch events from Firestore
const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(db, 'events')));
    let tempList = [];
    querySnapshot.forEach((eventDoc) => {
      const eventData = eventDoc.data();
      const averageRating = displayAverageRating(eventData);
      tempList.push({ title: eventData.title, details: eventData.details, date: convertToDate(eventData.date), address: eventData.address, averageRating: averageRating });
    });
    items.value = tempList;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

// Fetch events when component is mounted
onMounted(() => {
  fetchEvents();
});

// Reactive variable for the selected event to display in the modal
const selectedEvent = ref(null);

// Show event details in a modal
const viewDetails = (event) => {
  selectedEvent.value = event;
  const modalElement = document.getElementById('eventModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
};

// Hide the modal
const hideModal = () => {
  const modalElement = document.getElementById('eventModal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
    modal.hide();
  }
};
</script>

<template>
  <div>
    <!-- DataTable Component -->
   <EasyDataTable
    :headers="headers"
    :items="items"
   />
    
    <!-- Modal for event details -->
    <div
      class="modal fade"
      id="eventModal"
      tabindex="-1"
      aria-labelledby="eventModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventModalLabel">{{ selectedEvent?.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>Description:</strong> {{ selectedEvent?.description }}</p>
            <p><strong>Date:</strong> {{ selectedEvent?.date }}</p>
            <p><strong>Location:</strong> {{ selectedEvent?.location?.address }}</p>
            <p><strong>Reviews:</strong></p>
            <ul class="list-group">
              <li
                v-for="review in selectedEvent?.reviews"
                :key="review.username"
                class="list-group-item mb-2"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <strong>{{ review.username }}</strong>
                  <span class="badge bg-primary rounded-pill">{{ review.rating }}/5</span>
                </div>
                <p class="mb-1">{{ review.review }}</p>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hideModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styling (optional) */
</style>
