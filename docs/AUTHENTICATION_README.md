# Authentication System Implementation

## Overview

This document describes the updated authentication system for the Exam Portal application.

## Features

### Registration

- **Fields**: Username, Email, Password
- **Default Role**: Student (automatically assigned)
- **Email Validation**: Basic email format validation
- **Password Requirements**: Minimum 6 characters
- **User Data Storage**: Stored in Firebase Firestore with the following structure:
  ```javascript
  {
    username: string,
    email: string,
    role: "student", // default role
    results: [],
    createdAt: ISO string,
    uid: string
  }
  ```

### Login

- **Fields**: Email, Password, Class Selection
- **Class Selection**: Users must select their class (7th, 8th, 9th) during login
- **Test Filtering**: Tests are filtered based on the selected class
- **Role Support**: Supports both student and teacher roles (teacher roles can be created from Firebase dashboard)

## User Data Structure

### Student User

```javascript
{
  uid: string,
  username: string,
  email: string,
  role: "student",
  selectedClass: string, // "7th", "8th", or "9th"
  results: array,
  createdAt: string,
  loggedIn: boolean
}
```

### Teacher User (Future)

```javascript
{
  uid: string,
  username: string,
  email: string,
  role: "teacher",
  // Additional teacher-specific fields can be added
  createdAt: string,
  loggedIn: boolean
}
```

## Firebase Integration

### Authentication

- Uses Firebase Authentication for email/password authentication
- User credentials are stored securely in Firebase Auth

### Firestore Database

- User data is stored in the `users` collection
- Document ID is the user's UID
- Supports role-based access control

## Class-Based Test Filtering

### Available Classes

- 7th Class
- 8th Class
- 9th Class

### Test Filtering Logic

- Tests are filtered based on the `selectedClass` field in user data
- Only tests matching the user's selected class are displayed
- Study materials are also filtered by class

## Role Management

### Default Role

- All new registrations default to "student" role
- Role is stored in Firestore and can be modified from Firebase dashboard

### Teacher Role Creation

1. Register a new user (they will be assigned "student" role by default)
2. Go to Firebase Console > Firestore Database
3. Find the user document in the `users` collection
4. Manually change the `role` field from "student" to "teacher"

## Security Features

### Email Validation

- Basic email format validation during registration
- Prevents invalid email formats

### Password Security

- Minimum 6 character requirement
- Passwords are hashed and stored securely by Firebase

### Session Management

- User sessions are managed by Firebase Authentication
- Automatic session persistence across browser sessions

## File Structure

### Updated Files

- `src/pages/Login.jsx` - Updated login/register form
- `src/services/authService.js` - Enhanced authentication service
- `src/pages/Home.jsx` - Updated to use selectedClass for filtering
- `src/components/Topbar.jsx` - Updated to display selectedClass
- `src/pages/StudyMaterials.jsx` - Updated to filter by selectedClass

### Key Changes

1. **Login Form**: Now requires email, password, and class selection
2. **Register Form**: Requires username, email, and password
3. **User Data**: Uses `selectedClass` instead of `grade`
4. **Role System**: Supports both student and teacher roles
5. **Test Filtering**: Tests are filtered by the selected class

## Usage

### For Students

1. Register with username, email, and password
2. Login with email, password, and select your class
3. View tests and study materials specific to your class

### For Teachers (Future)

1. Register normally (will be assigned student role)
2. Contact administrator to change role to "teacher" in Firebase
3. Access teacher-specific features (to be implemented)

## Environment Variables

Ensure the following Firebase environment variables are set in your `.env` file:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
