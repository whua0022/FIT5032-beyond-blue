<script setup>
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import EventsList from '@/components/EventsList.vue'
import db from '../firebase/init'
import { collection, query, getDocs } from 'firebase/firestore'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import axios from 'axios'
import { currentUserStore } from '@/store'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY

const eventsList = ref([])
const userInput = ref('')
const suggestion = ref('')

const fetchEvents = async () => {
  try {
    const events = await getDocs(query(collection(db, 'events')))
    let tempList = []
    events.forEach((event) => {
      tempList.push({ id: event.id, ...event.data() })
    })
    eventsList.value = tempList
    addMarkersToMap()
  } catch (err) {
    console.error("Error fetching events: ", err)
  }
}

const addMarkersToMap = () => {
  for (const event of eventsList.value) {
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <h5>${event.title}</h5>
      <p>${event.details || 'No description available'}</p>
      <button class="btn btn-primary" id="getDirections-${event.id}">Get Directions</button>
    `)

    const marker = new mapboxgl.Marker()
      .setLngLat([event.location.lng, event.location.lat])
      .setPopup(popup)
      .addTo(map)

    marker.getElement().addEventListener('click', () => {
      setTimeout(() => {
        document
          .getElementById(`getDirections-${event.id}`)
          .addEventListener('click', () => {
            getDirections(event.location)
          })
      }, 500)
    })
  }
}

const getDirections = (destination) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
    })

    const directionsContainer = document.getElementById('directions-container')
    directionsContainer.innerHTML = ''
    directionsContainer.appendChild(directions.onAdd(map))

    directions.setOrigin([position.coords.longitude, position.coords.latitude])
    directions.setDestination([destination.lng, destination.lat])
  })
}

const getSuggestions = async () => {
  try {
    const descriptions = eventsList.value.map(event => event.details)
    
    const response = await axios.post('https://getsuggestionsfromgpt-zplbsdmahq-uc.a.run.app/getSuggestionsFromGPT', {
      descriptions: descriptions,
      userInput: userInput.value
    })

    suggestion.value = response.data.suggestion
  } catch (err) {
    console.error(err)
  }
}

let map

onMounted(() => {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.9631, -37.8136],
    zoom: 10,
  })

  map.addControl(new mapboxgl.NavigationControl())
  fetchEvents()
})
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <h1>Events Page</h1>
        <div v-if="currentUserStore?.isAdmin" class="mb-3">
          <RouterLink class="btn btn-success" to="/events/create">Create Event</RouterLink>
        </div>
        <EventsList />
      </div>

      <div class="col-md-6 position-relative">
        <div id="map" class="h-100 border" style="min-height: 500px;"></div>
      </div>

      <div class="col-md-3">
        <h4>Driving Directions</h4>
        <div id="directions-container" class="directions-container"></div>

        <button v-if="currentUserStore.email" type="button" class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#suggestionsModal">
          Get Suggestions
        </button>
      </div>
    </div>

    <div class="modal fade" id="suggestionsModal" tabindex="-1" aria-labelledby="suggestionsModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="suggestionsModalLabel">Enter your preferences</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label for="userInput" class="form-label">Enter your preferences:</label>
            <textarea id="userInput" v-model="userInput" class="form-control" rows="3" placeholder="Type what you're looking for in an event..."></textarea>

            <button type="button" class="btn btn-primary mt-3" @click="getSuggestions">Get help from our AI assistant</button>

            <p v-if="suggestion" class="mt-3"><strong>Suggestion:</strong> {{ suggestion }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#map {
  width: 100%;
  height: 500px;
}

.directions-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ddd;
}
</style>
