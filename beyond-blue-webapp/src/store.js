import { reactive } from 'vue'

export const currentUserStore = reactive({
    username: null,
    email: null,
    isAdmin: null,
    createdEvents: [],
    bookedEvents: [],
    setCurrentUser(username, email, isAdmin, createdEvents, bookedEvents) {
        this.username = username
        this.email = email
        this.isAdmin = isAdmin
        this.createdEvents = createdEvents
        this.bookedEvents = bookedEvents
    },
    getUserFromLocalStorage(email) {
        // Temporary implemenetation without external auth
        const users = JSON.parse(localStorage.getItem("users"))
        users.forEach(user => {
            if (user.email == email) {
                this.setCurrentUser(user.username, user.email, user.isAdmin, user.createdEvents, user.bookedEvents)
            }
        })
    }
})