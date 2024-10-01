<script setup>
import { ref } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import db from '@/firebase/init'
import { getAuth } from 'firebase/auth'
import { convertToDate } from '@/lib'

const userEvents = ref([])

const auth = getAuth()

const exportToCSV = async () => {
  try {
    const events = await getDocs(query(collection(db, "events"), where("creatorId", "==", auth.currentUser.uid)))

    userEvents.value = events.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    if (userEvents.value.length == 0) {
      alert("No events found to export.")
      return
    }

    let csvRows = []
    const headers = ["Title", "Address", "Date", "Details", "Subscribers", "Reviews"]
    csvRows.push(headers.join(","))

    userEvents.value.forEach(event => {
      const { title, address, date, details, subscribers, reviews } = event
      const subscribersList = subscribers.join(";")
      const reviewsList = reviews.map(review => `${review.username}: ${review.comment}`).join("; ")

      const row = [title, address, convertToDate(date), details, subscribersList, reviewsList]
      csvRows.push(row.join(","))
    })

    const csvContent = `data:text/csv;charset=utf-8,${csvRows.join("\n")}`
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "user_events.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error exporting to CSV: ", error)
  }
}
</script>

<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Admin Page</h1>
    <div class="row justify-content-center">
      <div class="col-md-6 d-grid gap-3">
        <RouterLink class="btn btn-primary" to="/events/create">Create Event</RouterLink>
        <RouterLink class="btn btn-primary" to="/events/notifications">Send Notifications</RouterLink>
        <RouterLink class="btn btn-primary" to="/events/manage">Manage My Events</RouterLink>
        <button class="btn btn-warning mt-3" @click="exportToCSV">Export My Events as CSV</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    max-width: 600px;
  }
</style>
