<!-- EventsView.vue -->
<script setup>
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import EventsList from '@/components/EventsList.vue';
import db from '../firebase/init';
import { collection, query, getDocs } from 'firebase/firestore';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

const eventsList = ref([]);

const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(db, 'events')));
    let tempList = [];
    querySnapshot.forEach((event) => {
      tempList.push({ id: event.id, ...event.data() });
    });
    console.log('Fetched events:', tempList);
    eventsList.value = tempList;

    // Add markers after fetching events
    addMarkersToMap();
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

const addMarkersToMap = () => {
  eventsList.value.forEach((event) => {
    console.log(event.location);
    if (event.location && event.location.lng && event.location.lat) {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h5>${event.title}</h5>
        <p>${event.description || 'No description available'}</p>
      `);

      // Add marker to map
      new mapboxgl.Marker()
        .setLngLat([event.location.lng, event.location.lat]) // lng comes before lat
        .setPopup(popup) // Add the popup to the marker
        .addTo(map);
    }
  });
};

let map;

onMounted(() => {
  // Initialize the Mapbox map
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.9631, -37.8136], // Melbourne, Australia coordinates
    zoom: 10,
  });

  // Add navigation controls (zoom in/out)
  map.addControl(new mapboxgl.NavigationControl());

  // Fetch events after the map is initialized
  fetchEvents();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Left Column: Events List -->
      <div class="col-md-4">
        <h1>Events Page</h1>
        <div v-if="currentUserStore?.isAdmin" class="mb-3">
          <RouterLink class="btn btn-success" to="/events/create">Create Event</RouterLink>
        </div>
        <EventsList />
      </div>

      <!-- Right Column: Map -->
      <div class="col-md-8">
        <div id="map" class="h-100 border" style="min-height: 500px;"></div>
      </div>
    </div>
  </div>
</template>

<style>
#map {
  width: 100%;
  height: 500px;
}
</style>
