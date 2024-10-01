<script setup>
import { ref } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '@/firebase/init';
import { getAuth } from 'firebase/auth';
import { convertToDate } from '@/lib';

// Store for user's events
const userEvents = ref([]);

const auth = getAuth();

// Function to fetch all events owned by the current user and export them as CSV
const exportToCSV = async () => {
  try {
    // Fetch the user's events
    const q = query(collection(db, "events"), where("creatorId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    userEvents.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (userEvents.value.length === 0) {
      alert("No events found to export.");
      return;
    }

    // Prepare CSV content
    const csvRows = [];
    const headers = ["Title", "Address", "Date", "Details", "Subscribers", "Reviews"]; // Add headers for the CSV
    csvRows.push(headers.join(",")); // Add the headers row

    userEvents.value.forEach(event => {
      const { title, address, date, details, subscribers, reviews } = event;
      const subscribersList = subscribers.join(";");
      const reviewsList = reviews.map(review => `${review.username}: ${review.comment}`).join("; ");

      const row = [title, address, convertToDate(date), details, subscribersList, reviewsList];
      csvRows.push(row.join(","));
    });

    // Convert rows into a CSV file
    const csvContent = `data:text/csv;charset=utf-8,${csvRows.join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_events.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error fetching user events or exporting to CSV: ", error);
  }
};
</script>

<template>
  <div>
    <h1>Admin Page</h1>
    <RouterLink class="btn btn-primary" to="/events/create">Create Event</RouterLink>
    <RouterLink class="btn btn-primary" to="/events/notifications">Send Notifications</RouterLink>
    
    <!-- Button to export user's events to CSV -->
    <button class="btn btn-warning mt-3" @click="exportToCSV">Export My Events as CSV</button>
  </div>
</template>
