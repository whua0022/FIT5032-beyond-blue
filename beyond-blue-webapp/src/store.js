import { getAuth } from 'firebase/auth'
import { collection, getDocs, where, query} from 'firebase/firestore'
import { reactive } from 'vue'
import db from './firebase/init'

export const currentUserStore = reactive({
    email: null,
    isAdmin: null,
    setCurrentUser(email) {
        this.email = email
    },
    async validateRole() {
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        
        try {
            const res = await getDocs(query(collection(db, "users"), where("userId", "==", userId)))
            if (res.docs[0].data().role === "ADMIN") {
                this.isAdmin = true
            }
        } catch (error) {
            console.error("Error fetching user roles", error);
        }
    }
})