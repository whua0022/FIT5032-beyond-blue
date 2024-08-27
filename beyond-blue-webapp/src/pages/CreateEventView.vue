<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
const eventData = ref({
    title: '',
    description: '',
    location: '',
    date: '',
})

const errors = ref({
    title: null,
    description: null,
    location: null,
    date: null
})

const router = useRouter()

const submitForm = () => {
  validateTitle(true)
  if (!errors.value.username) {
    clearForm()
  }
  router.push('/events')
}

const clearForm = () => {
  eventData.value = {
    title: '',
    description: '',
    location: '',
    date: '',
  }
}

const validateTitle = (blur) => {
  if (eventData.value.title.length < 3) {
    if (blur) errors.value.title = 'Title must be at least 3 characters'
  } else {
    errors.value.title = null
  }
}

</script>

<template>
    <form @submit.prevent="submitForm" class="w-100 mx-auto form-container mt-5 p-5 border">
        <div class="mb-3">
            <label for="titleInput" class="form-label">Title</label>
            <input type="text" class="form-control" id="titleInput"  @blur="() => validateTitle(true)" @input="() => validateTitle(false)" v-model="eventData.title" required>
            <div v-if="errors.title" class="text-danger">{{ errors.username }}</div>
        </div>
        <div class="mb-3">
            <label for="descriptionInput" class="form-label">Description</label>
            <input type="text" class="form-control" id="descriptionInput" v-model="eventData.description" required>
        </div>
        <div class="mb-3">
            <label for="locationInput" class="form-label">Location</label>
            <input type="text" class="form-control" id="locationInput"  v-model="eventData.location" required>
        </div>
        <div class="mb-3">
            <label for="dateInput" class="form-label">Date</label>
            <input type="date" class="form-control" id="dateInput"  v-model="eventData.date" required>
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-primary" :disabled="eventError">Create event</button>
        </div>
      </form>
</template>