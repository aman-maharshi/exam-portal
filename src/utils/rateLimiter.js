// Rate limiting utility using localStorage
const RATE_LIMIT_CONFIG = {
  signup: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    key: "rate_limit_signup"
  },
  forgotPassword: {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
    key: "rate_limit_forgot_password"
  },
  signin: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    key: "rate_limit_signin"
  }
}

class RateLimiter {
  constructor() {
    this.config = RATE_LIMIT_CONFIG
  }

  // Get stored attempts for a specific action
  getStoredAttempts(action) {
    try {
      const stored = localStorage.getItem(this.config[action].key)
      return stored ? JSON.parse(stored) : { attempts: 0, firstAttempt: null }
    } catch (error) {
      console.error("Error reading rate limit data:", error)
      return { attempts: 0, firstAttempt: null }
    }
  }

  // Store attempts for a specific action
  storeAttempts(action, data) {
    try {
      localStorage.setItem(this.config[action].key, JSON.stringify(data))
    } catch (error) {
      console.error("Error storing rate limit data:", error)
    }
  }

  // Check if an action is rate limited
  isRateLimited(action) {
    const config = this.config[action]
    if (!config) {
      console.error(`Unknown action: ${action}`)
      return false
    }

    const now = Date.now()
    const stored = this.getStoredAttempts(action)

    // If no previous attempts, allow
    if (stored.attempts === 0) {
      return false
    }

    // Check if window has expired
    if (now - stored.firstAttempt > config.windowMs) {
      // Reset attempts if window has expired
      this.storeAttempts(action, { attempts: 0, firstAttempt: null })
      return false
    }

    // Check if max attempts exceeded
    return stored.attempts >= config.maxAttempts
  }

  // Record an attempt for an action
  recordAttempt(action) {
    const config = this.config[action]
    if (!config) {
      console.error(`Unknown action: ${action}`)
      return
    }

    const now = Date.now()
    const stored = this.getStoredAttempts(action)

    if (stored.attempts === 0) {
      // First attempt
      this.storeAttempts(action, { attempts: 1, firstAttempt: now })
    } else {
      // Check if window has expired
      if (now - stored.firstAttempt > config.windowMs) {
        // Reset if window has expired
        this.storeAttempts(action, { attempts: 1, firstAttempt: now })
      } else {
        // Increment attempts
        this.storeAttempts(action, {
          attempts: stored.attempts + 1,
          firstAttempt: stored.firstAttempt
        })
      }
    }
  }

  // Get remaining attempts for an action
  getRemainingAttempts(action) {
    const config = this.config[action]
    if (!config) return 0

    const stored = this.getStoredAttempts(action)
    const now = Date.now()

    // If window has expired, reset
    if (stored.attempts > 0 && now - stored.firstAttempt > config.windowMs) {
      this.storeAttempts(action, { attempts: 0, firstAttempt: null })
      return config.maxAttempts
    }

    return Math.max(0, config.maxAttempts - stored.attempts)
  }

  // Get time remaining until reset (in milliseconds)
  getTimeUntilReset(action) {
    const config = this.config[action]
    if (!config) return 0

    const stored = this.getStoredAttempts(action)
    if (stored.attempts === 0) return 0

    const now = Date.now()
    const timeElapsed = now - stored.firstAttempt
    return Math.max(0, config.windowMs - timeElapsed)
  }

  // Format time remaining as human readable string
  formatTimeRemaining(action) {
    const ms = this.getTimeUntilReset(action)
    if (ms === 0) return ""

    const minutes = Math.floor(ms / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  // Clear rate limit data for an action (useful for testing or manual reset)
  clearRateLimit(action) {
    try {
      localStorage.removeItem(this.config[action].key)
    } catch (error) {
      console.error("Error clearing rate limit data:", error)
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()
