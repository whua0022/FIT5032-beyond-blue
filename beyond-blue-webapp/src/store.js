import { reactive } from 'vue'

export const currentUserStore = reactive({
    username: null,
    email: null,
    isAdmin: null
})