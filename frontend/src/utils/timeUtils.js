/**
 * Calculate days since a given date
 * @param {string|Date} date - The date to calculate from
 * @returns {number} Number of days
 */
export const daysSince = (date) => {
  if (!date) return 0
  const now = new Date()
  const past = new Date(date)
  const diff = now - past
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Format time ago string (e.g., "2 days ago", "3 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted time ago string
 */
export const timeAgo = (date) => {
  if (!date) return 'Unknown'

  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now - past) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit)
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`
    }
  }

  return 'Just now'
}

/**
 * Format date to readable string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format date and time to readable string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
