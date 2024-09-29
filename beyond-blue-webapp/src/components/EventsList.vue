<!-- EventsList.vue -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import db from '../firebase/init';
import { collection, query, getDocs } from 'firebase/firestore';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import { convertToDate } from '@/lib';

const items = ref([]);

const displayAverageRating = (event) => {
  if (!event.reviews || event.reviews.length === 0) return 'No ratings';
  let score = 0;
  event.reviews.forEach((review) => {
    score += review.rating;
  });
  return Math.floor(score / event.reviews.length);
};

const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(db, 'events')));
    let tempList = [];
    querySnapshot.forEach((eventDoc) => {
      const eventData = eventDoc.data();
      const averageRating = displayAverageRating(eventData);
      tempList.push({
        title: eventData.title,
        date: convertToDate(eventData.date),
        averageRating: averageRating,
        reviews: eventData.reviews,
        details: eventData.details,
        address: eventData.address,
      });
    });
    items.value = tempList;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

onMounted(() => {
  fetchEvents();
});

const selectedEvent = ref(null);

const viewDetails = (event) => {
  selectedEvent.value = event;
  const modalElement = document.getElementById('eventModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
};

const hideModal = () => {
  const modalElement = document.getElementById('eventModal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
    modal.hide();
  }
};

// Sorting
const sortKey = ref(''); // 'title', 'date', 'averageRating'
const sortOrder = ref(1); // 1 for ascending, -1 for descending

const selectedSortOption = ref('');

// Update the sortKey based on the selected option
watch(selectedSortOption, (newVal) => {
  if (newVal === 'date' || newVal === 'title' || newVal === 'averageRating') {
    sortKey.value = newVal;
  } else {
    sortKey.value = '';
  }
});

// Searching
const searchTitle = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage);
});

// Computed property for sorted, searched, and paginated items
const filteredItems = computed(() => {
  let tempItems = items.value;

  // Search
  if (searchTitle.value) {
    tempItems = tempItems.filter(item =>
      item.title.toLowerCase().includes(searchTitle.value.toLowerCase())
    );
  }

  // Sort
  if (sortKey.value) {
    tempItems = tempItems.slice().sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];

      if (sortKey.value === 'date') {
        valA = new Date(valA);
        valB = new Date(valB);
      } else if (sortKey.value === 'averageRating') {
        valA = valA === 'No ratings' ? 0 : valA;
        valB = valB === 'No ratings' ? 0 : valB;
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return -1 * sortOrder.value;
      if (valA > valB) return 1 * sortOrder.value;
      return 0;
    });
  }

  return tempItems;
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<template>
  <div>
    <!-- Search Input for Title Column -->
    <div class="mb-3">
      <label for="searchTitle" class="form-label">Search by Title:</label>
      <input type="text" id="searchTitle" v-model="searchTitle" class="form-control" placeholder="Search Title">
    </div>

    <!-- Sort Dropdown -->
    <div class="mb-3">
      <label for="sortOption" class="form-label">Sort by:</label>
      <select id="sortOption" v-model="selectedSortOption" class="form-select">
        <option value="">Select</option>
        <option value="title">Title</option>
        <option value="date">Date</option>
        <option value="averageRating">Rating</option>
      </select>
    </div>

    <!-- Data Table -->
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Rating</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedItems" :key="item.title">
            <td>{{ item.title }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.averageRating }}</td>
            <td>
              <button
                class="btn btn-primary btn-sm"
                @click="viewDetails(item)"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">Previous</a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>

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
            <p><strong>Description:</strong> {{ selectedEvent?.details }}</p>
            <p><strong>Date:</strong> {{ selectedEvent?.date }}</p>
            <p><strong>Location:</strong> {{ selectedEvent?.address }}</p>
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
