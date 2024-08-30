<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { currentUserStore } from '@/store';

const route = useRoute()
const eventId = route.query.eventId
const title = route.query.eventTitle

const data = ref({
    rating: '',
    review: ''
})

const errors = ref({
    username: null,
    rating: null,
    review: null
})
const clearForm = () => {
  data.value = {
    username: currentUserStore.username,
    rating: '',
    review: ''
  }
}

const submitForm = () => {
    const events = JSON.parse(localStorage.getItem("events"))
    const eventIndex = events.findIndex(event => event.id == eventId)
    let newEventInfo = events[eventIndex]
    newEventInfo.reviews.push({
        username: currentUserStore.username,
        rating: data.value.rating,
        review: data.value.review
    })
    events[eventIndex] = newEventInfo
    localStorage.setItem("events", JSON.stringify(events))
    if (!errors.value.username) {
        clearForm()
    }
    const router = useRouter()
    router.push('/events')
}

const validateRating = (blur) => {
    if (data.value.rating < 1 || data.value.rating > 5) {
        if (blur) errors.value.rating = 'Rating must be from 1 to 5'
    } else {
        errors.value.rating = null
    }
}

const validateReview = (blur) => {
    if (data.value.review.length < 1) {
    if (blur) errors.value.review = 'Review must not be empty'
  } else {
    errors.value.review = null
  }
}
</script>

<template>
    <h1>Review page</h1>
    <form @submit.prevent="submitForm" class="w-100 mx-auto form-container mt-5 p-5 border">
      <div class="mb-3">
          <h1>{{ title }}</h1>
      </div>
      <div class="mb-3">
          <label for="ratingInput" class="form-label">Rating out of 5</label>
          <input type="number" class="form-control" id="ratingInput" @blur="() => validateRating(true)" @input="() => validateRating(false)" v-model="data.rating" required>
      </div>
      <div class="mb-3">
          <label for="reviewInput" class="form-label">Review</label>
          <textarea class="form-control" id="reviewInput" @blur="() => validateReview(true)" @input="() => validateReview(false)" v-model="data.review" required></textarea>
      </div>
      <div class="d-grid">
        <button type="submit" class="btn btn-primary" :disabled="addError">Add Rating</button>
      </div>
    </form>
</template>