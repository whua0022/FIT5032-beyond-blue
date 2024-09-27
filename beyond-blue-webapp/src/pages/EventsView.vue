<script setup>
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import EventsList from '@/components/EventsList.vue';
import db from '../firebase/init';
import { collection, query, getDocs } from "firebase/firestore";

// Load the Mapbox API key from environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY; // Accessing the environment variable

// Reactive variable for events list
const eventsList = ref([]);

// Fetch events from Firestore
const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "events")));
    let tempList = [];
    querySnapshot.forEach((event) => {
      tempList.push({ id: event.id, ...event.data() });
    });
    console.log("Fetched events:", tempList);
    eventsList.value = tempList;

    // Add markers after fetching events
    addMarkersToMap();
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

// Function to add markers to the map based on event locations
const addMarkersToMap = () => {
  eventsList.value.forEach((event) => {
    console.log(event.location)
    if (event.location && event.location.lng && event.location.lat) {
      // Swapping lat and lng if they are reversed
      new mapboxgl.Marker()
        .setLngLat([event.location.lat, event.location.lng]) // Correct order
        .setPopup(new mapboxgl.Popup().setHTML(`<h5>${event.title}</h5><p>${event.description}</p>`))
        .addTo(map);
    }
  });
};
// Map instance variable
let map;

// Initialize the map and fetch events when the component is mounted
onMounted(() => {
  // Initialize the map
  map = new mapboxgl.Map({
    container: 'map', // HTML element id where the map will render
    style: 'mapbox://styles/mapbox/streets-v11', // Mapbox style
    center: [144.9631, -37.8136], // Default center coordinates (Melbourne)
    zoom: 10 // Default zoom level
  });

  // Add navigation controls (zoom in/out)
  map.addControl(new mapboxgl.NavigationControl());

  // Fetch events and add markers
  fetchEvents();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Event list column -->
      <div class="col-md-4">
        <h1>Events page</h1>
        <div v-if="currentUserStore?.isAdmin" class="mb-3">
          <RouterLink class="btn btn-success" to="/events/create">Create event</RouterLink>
        </div>
        <EventsList></EventsList>
      </div>

      <!-- Map column -->
      <div class="col-md-8">
        <div id="map" class="h-100 border" style="min-height: 500px;"></div>
      </div>
    </div>
  </div>
</template>

<style>
/* Set height and width for the map */
#map {
  width: 100%;
  height: 100%;
}
</style>
