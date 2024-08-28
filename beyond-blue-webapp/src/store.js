import { reactive } from 'vue'

export const currentUserStore = reactive({
    username: null,
    email: null,
    isAdmin: null,
    setCurrentUser(username, email, isAdmin) {
        this.username = username
        this.email = email
        this.isAdmin = isAdmin
    }
})