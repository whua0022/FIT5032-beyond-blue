<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import db from '../firebase/init'
import { collection, query, getDocs } from 'firebase/firestore'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import { convertToDate } from '@/lib'

const items = ref([])
const sortKey = ref('')
const sortOrder = ref(1)
const selectedSortOption = ref('')
const searchTitle = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedEvent = ref(null)

const displayAverageRating = (event) => {
  if (!event.reviews || event.reviews.length === 0) return 'No ratings'
  let score = 0
  event.reviews.forEach((review) => {
    score += review.rating
  })
  return Math.floor(score / event.reviews.length)
}

const fetchEvents = async () => {
  try {
    const events = await getDocs(query(collection(db, 'events')))
    let tempList = []
    events.forEach((event) => {
      const eventData = event.data()
      const averageRating = displayAverageRating(eventData)
      tempList.push({
        title: eventData.title,
        date: convertToDate(eventData.date),
        averageRating: averageRating,
        reviews: eventData.reviews,
        details: eventData.details,
        address: eventData.address,
      })
    })
    items.value = tempList
  } catch (error) {
    console.error('Error getting events', error)
  }
}

onMounted(() => {
  fetchEvents()
})

const viewDetails = (event) => {
  selectedEvent.value = event
  const modalElement = document.getElementById('eventModal')
  const modal = new bootstrap.Modal(modalElement)
  modal.show()
}

const hideModal = () => {
  const modalElement = document.getElementById('eventModal')
  const modal = bootstrap.Modal.getInstance(modalElement)
  if (modal) {
    modal.hide()
  }
}

watch(selectedSortOption, (newVal) => {
  newVal == 'date' || newVal == 'title' || newVal == 'averageRating' ? sortKey.value = newVal : sortKey.value = ''
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage)
})

const filteredItems = computed(() => {
  let tempItems = items.value

  if (searchTitle.value) {
    tempItems = tempItems.filter(item =>
      item.title.toLowerCase().includes(searchTitle.value.toLowerCase())
    )
  }

  if (sortKey.value) {
    tempItems = tempItems.slice().sort((a, b) => {
      let val1 = a[sortKey.value]
      let val2 = b[sortKey.value]

      if (sortKey.value == 'date') {
        val1 = new Date(val1)
        val2 = new Date(val2)
      } else if (sortKey.value == 'averageRating') {
        val1 = val1 === 'No ratings' ? 0 : val1
        val2 = val2 === 'No ratings' ? 0 : val2
      } else if (typeof val1 == 'string' && typeof val2 == 'string') {
        val1 = val1.toLowerCase()
        val2 = val2.toLowerCase()
      }

      if (val1 < val2) return -1 * sortOrder.value
      if (val1 > val2) return 1 * sortOrder.value
      return 0
    })
  }

  return tempItems
})

const paginatedItems = computed(() => {
  return filteredItems.value.slice((currentPage.value - 1) * itemsPerPage, start + itemsPerPage)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

</script>

<template>  <div>
    <div class="mb-3">
      <label for="searchTitle" class="form-label">Search by Title:</label>
      <input type="text" id="searchTitle" v-model="searchTitle" class="form-control" placeholder="Search Title">
    </div>

    <div class="mb-3">
      <label for="sortOption" class="form-label">Sort by:</label>
      <select id="sortOption" v-model="selectedSortOption" class="form-select">
        <option value="">Select</option>
        <option value="title">Title</option>
        <option value="date">Date</option>
        <option value="averageRating">Rating</option>
      </select>
    </div>

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

    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">Previous</a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage == page }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage=== totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>

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
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Description:</strong> {{ selectedEvent?.details }}</p>
            <p><strong>Date:</strong> {{ selectedEvent?.date }}</p>
            <p><strong>Location:</strong> {{ selectedEvent?.address }}</p>
            <p><strong>Reviews:</strong></p>
            <div class="table-responsive">
              <table class="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="review in selectedEvent?.reviews" :key="review.title">
                    <td>{{ review.username }}</td>
                    <td>{{ convertToDate(review.date) }}</td>
                    <td>{{ review.rating }}</td>
                    <td>{{ review.comment }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
</style>
