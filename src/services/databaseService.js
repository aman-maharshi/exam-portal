import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore"
import { db } from "../firebase"

export const databaseService = {
  // Save test result with enhanced validation and error handling
  async saveTestResult(userId, testResult) {
    try {
      // Validate required fields
      if (!userId || !testResult.testId || testResult.totalMarks === undefined) {
        return { success: false, error: "Missing required fields" }
      }

      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        return { success: false, error: "User not found" }
      }

      const userData = userDoc.data()

      // Check if test result already exists
      const existingResultIndex = userData.results?.findIndex(result => result.testId === testResult.testId)

      let updatedResults
      if (existingResultIndex !== -1) {
        // Update existing result
        updatedResults = userData.results.map((result, index) =>
          index === existingResultIndex ? { ...result, ...testResult } : result
        )
      } else {
        // Add new result
        updatedResults = [...(userData.results || []), testResult]
      }

      // Add metadata
      const resultWithMetadata = {
        ...testResult,
        submittedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }

      await updateDoc(userRef, {
        results: updatedResults,
        lastUpdated: new Date().toISOString(),
        totalTestsTaken: updatedResults.length,
        averageScore: Math.round(
          updatedResults.reduce((acc, result) => acc + result.percentage, 0) / updatedResults.length
        )
      })

      return { success: true, result: resultWithMetadata }
    } catch (error) {
      console.error("Error saving test result:", error)
      return { success: false, error: error.message }
    }
  },

  // Get user results with real-time updates
  async getUserResults(userId) {
    try {
      if (!userId) {
        return { success: false, error: "User ID is required" }
      }

      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        return { success: false, error: "User not found" }
      }

      const userData = userDoc.data()
      const results = userData.results || []

      // Sort results by submission date (newest first)
      const sortedResults = results.sort(
        (a, b) => new Date(b.submittedAt || b.createdAt || 0) - new Date(a.submittedAt || a.createdAt || 0)
      )

      return {
        success: true,
        results: sortedResults,
        userStats: {
          totalTestsTaken: userData.totalTestsTaken || 0,
          averageScore: userData.averageScore || 0,
          lastTestDate: sortedResults[0]?.submittedAt || null
        }
      }
    } catch (error) {
      console.error("Error getting user results:", error)
      return { success: false, error: error.message }
    }
  },

  // Listen to real-time user data changes
  subscribeToUserData(userId, callback) {
    if (!userId) return null

    const userRef = doc(db, "users", userId)
    return onSnapshot(
      userRef,
      doc => {
        if (doc.exists()) {
          const userData = doc.data()
          callback({ success: true, user: { id: doc.id, ...userData } })
        } else {
          callback({ success: false, error: "User not found" })
        }
      },
      error => {
        console.error("Error listening to user data:", error)
        callback({ success: false, error: error.message })
      }
    )
  },

  // Get test result by ID
  async getTestResult(userId, testId) {
    try {
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        return { success: false, error: "User not found" }
      }

      const userData = userDoc.data()
      const result = userData.results?.find(result => result.testId === parseInt(testId))

      if (!result) {
        return { success: false, error: "Test result not found" }
      }

      return { success: true, result }
    } catch (error) {
      console.error("Error getting test result:", error)
      return { success: false, error: error.message }
    }
  },

  // Update user profile with enhanced validation
  async updateUserProfile(userId, userData) {
    try {
      if (!userId) {
        return { success: false, error: "User ID is required" }
      }

      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        return { success: false, error: "User not found" }
      }

      await updateDoc(userRef, {
        ...userData,
        lastUpdated: new Date().toISOString()
      })

      return { success: true }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return { success: false, error: error.message }
    }
  },

  // Get user statistics
  async getUserStats(userId) {
    try {
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        return { success: false, error: "User not found" }
      }

      const userData = userDoc.data()
      const results = userData.results || []

      const stats = {
        totalTestsTaken: results.length,
        averageScore:
          results.length > 0
            ? Math.round(results.reduce((acc, result) => acc + result.percentage, 0) / results.length)
            : 0,
        highestScore: results.length > 0 ? Math.max(...results.map(result => result.percentage)) : 0,
        testsByDifficulty: {
          Easy: results.filter(result => result.difficulty === "Easy").length,
          Moderate: results.filter(result => result.difficulty === "Moderate").length
        },
        recentTests: results.slice(0, 5) // Last 5 tests
      }

      return { success: true, stats }
    } catch (error) {
      console.error("Error getting user stats:", error)
      return { success: false, error: error.message }
    }
  },

  // Get all users (for admin/teacher dashboard)
  async getAllUsers() {
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const users = []
      querySnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() })
      })

      return { success: true, users }
    } catch (error) {
      console.error("Error getting all users:", error)
      return { success: false, error: error.message }
    }
  },

  // Get users by role (for teacher dashboard)
  async getUsersByRole(role) {
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "==", role), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const users = []
      querySnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() })
      })

      return { success: true, users }
    } catch (error) {
      console.error("Error getting users by role:", error)
      return { success: false, error: error.message }
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      if (!userId) {
        return { success: false, error: "User ID is required" }
      }

      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        return { success: true, user: { id: userDoc.id, ...userDoc.data() } }
      } else {
        return { success: false, error: "User not found" }
      }
    } catch (error) {
      console.error("Error getting user by ID:", error)
      return { success: false, error: error.message }
    }
  },

  // Delete test result (for retaking tests)
  async deleteTestResult(userId, testId) {
    try {
      if (!userId || !testId) {
        return { success: false, error: "User ID and Test ID are required" }
      }

      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        return { success: false, error: "User not found" }
      }

      const userData = userDoc.data()
      const updatedResults = userData.results?.filter(result => result.testId !== parseInt(testId)) || []

      await updateDoc(userRef, {
        results: updatedResults,
        lastUpdated: new Date().toISOString(),
        totalTestsTaken: updatedResults.length
      })

      return { success: true }
    } catch (error) {
      console.error("Error deleting test result:", error)
      return { success: false, error: error.message }
    }
  }
}
