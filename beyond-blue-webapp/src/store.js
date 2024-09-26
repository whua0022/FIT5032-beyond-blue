import { reactive } from 'vue'

export const currentUserStore = reactive({
    email: null,
    isAdmin: null,
    setCurrentUser(email, isAdmin) {
        this.email = email
        this.isAdmin = isAdmin
    }
})