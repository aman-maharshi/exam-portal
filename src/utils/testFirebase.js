import { auth, db } from "../firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

export const testFirebaseConnection = async () => {
  try {
    // Test Firestore connection with a simpler approach
    const testDoc = doc(db, "test", "connection")

    // Try to write first (this will create the document if it doesn't exist)
    await setDoc(testDoc, {
      timestamp: new Date().toISOString(),
      message: "Firebase connection successful",
      test: true
    })

    console.log("✅ Firebase write successful")

    // Now try to read it back
    const docSnap = await getDoc(testDoc)
    if (docSnap.exists()) {
      console.log("✅ Firebase read successful:", docSnap.data())
    }

    return { success: true, message: "Firebase connected successfully" }
  } catch (error) {
    console.error("❌ Firebase connection failed:", error)

    // Provide more specific error messages
    let errorMessage = error.message
    if (error.code === "permission-denied") {
      errorMessage =
        "Permission denied. Please check Firestore security rules and make sure they allow read/write access."
    } else if (error.code === "unavailable") {
      errorMessage = "Firestore database not available. Make sure it's created and in test mode."
    } else if (error.code === "unauthenticated") {
      errorMessage = "Authentication required. Please log in first."
    }

    return { success: false, error: errorMessage }
  }
}
