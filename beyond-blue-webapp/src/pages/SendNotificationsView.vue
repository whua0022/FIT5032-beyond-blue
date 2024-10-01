<script setup>
import db from '@/firebase/init'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(import.meta.env.VITE_SENDGRID_KEY)

const eventsList = ref([])
const selectedEvent = ref(null)
const emailSubject = ref('')
const emailMessage = ref('')

const fetchEvents = async () => {
  const auth = getAuth()

  try {
    const res = await getDocs(query(collection(db, 'events'), where('creatorId', '==', auth.currentUser.uid)))
    eventsList.value = res.docs.map((val) => ({ id: val.id, ...val.data() }))
  } catch (err) {
    console.error(err)
  }
}

const openModal = (event) => {
  selectedEvent.value = event
  emailSubject.value = ''
  emailMessage.value = ''
  const modal = new bootstrap.Modal(document.getElementById('emailModal'))
  modal.show()
}

const sendEmail = async (subscribers) => {
  for (const email of subscribers) {
    const emailData = {
      to: email,
      emailSubject: emailSubject.value,
      emailMessage: emailMessage.value,
    }

    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })

      if (response.ok) {
        window.alert('Emails sent successfully')
      } else {
       window.alert('Failed to send emails')
      }
    } catch (error) {
      console.error('Error sending email', error)
    }
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('emailModal'))
  modal.hide()
}

onMounted(() => {
  fetchEvents()
})

</script>

<template>
  <div class="container mt-4">
    <h1>Send Notifications</h1>
    <div class="row">
      <div v-for="event in eventsList" :key="event.id" class="col-md-4 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ event.title }}</h5>
            <p class="card-text">{{ event.description }}</p>
            <button class="btn btn-primary" @click="openModal(event)">Send Notification</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="emailModal" tabindex="-1" aria-labelledby="emailModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="emailModalLabel">Send Notification for {{ selectedEvent?.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="emailSubject" class="form-label">Email Title</label>
              <input type="text" class="form-control" id="emailSubject" v-model="emailSubject" />
            </div>
            <div class="mb-3">
              <label for="emailMessage" class="form-label">Email Message</label>
              <textarea class="form-control" id="emailMessage" rows="4" v-model="emailMessage"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="sendEmail(selectedEvent.subscribers)">Send Email</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
