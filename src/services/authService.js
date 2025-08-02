import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

export const authService = {
  // Register new user
  async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Save additional user data to Firestore with role management
      await setDoc(doc(db, "users", user.uid), {
        ...userData,
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        results: [],
        // Role is set to "student" by default, can be changed from Firebase dashboard
        role: userData.role || "student"
      })

      return { success: true, user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))
      const userData = userDoc.data()

      if (!userData) {
        return { success: false, error: "User data not found" }
      }

      return { success: true, user: { ...user, ...userData } }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback)
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      // Firebase doesn't distinguish between "user not found" and "email sent" for security
      // Common error codes: auth/user-not-found, auth/invalid-email
      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
        return { success: true } // Treat as success for security
      }
      return { success: false, error: error.message }
    }
  }
}
