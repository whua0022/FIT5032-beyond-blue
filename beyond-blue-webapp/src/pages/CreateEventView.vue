<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
const data = ref({
    id: '',
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

  // Add to local storage here
  const events = JSON.parse(localStorage.getItem("events") || "[]")
  const newEvent = {
    id: events.length + 1,
    title: data.value.title,
    description: data.value.description,
    location: data.value.location,
    date: data.value.date,
    reviews: []
  }
  events.push(newEvent)
  localStorage.setItem("events", JSON.stringify(events))
  if (!errors.value.username) {
    clearForm()
  }
  router.push('/events')
}

const clearForm = () => {
  data.value = {
    title: '',
    description: '',
    location: '',
    date: '',
  }
}

const validateTitle = (blur) => {
  if (data.value.title.length < 3) {
    if (blur) errors.value.title = 'Title must be at least 3 characters'
  } else {
    errors.value.title = null
  }
}

const validateDescription = (blur) => {
  if (data.value.description.length < 1) {
    if (blur) errors.value.description = 'Description must not be empty'
  } else {
    errors.value.description = null
  }
}

const validateDate = (blur) => {
  const today = new Date()

  if (data.value.date <= today) {
    if (blur) errors.value.date = 'Date must be later than today'
  } else {
    errors.value.date = null
  }
}

</script>

<template>
    <form @submit.prevent="submitForm" class="w-100 mx-auto form-container mt-5 p-5 border">
        <div class="mb-3">
            <label for="titleInput" class="form-label">Title</label>
            <input type="text" class="form-control" id="titleInput"  @blur="() => validateTitle(true)" @input="() => validateTitle(false)" v-model="data.title" required>
            <div v-if="errors.title" class="text-danger">{{ errors.username }}</div>
        </div>
        <div class="mb-3">
            <label for="descriptionInput" class="form-label">Description</label>
            <input type="text" class="form-control" id="descriptionInput" @blur="() => validateDescription(true)" @input="() => validateDescription(false)" v-model="data.description" required>
        </div>
        <div class="mb-3">
            <label for="locationInput" class="form-label">Location</label>
            <input type="text" class="form-control" id="locationInput"  v-model="data.location" required>
        </div>
        <div class="mb-3">
            <label for="dateInput" class="form-label">Date</label>
            <input type="date" class="form-control" id="dateInput" @blur="() => validateDate(true)" @input="() => validateDate(false)" v-model="data.date" required>
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-primary" :disabled="eventError">Create event</button>
        </div>
      </form>
</template>