const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const TOKEN_KEY = 'campus-event-hub:token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function normalizeUser(user) {
  if (!user) return null

  return {
    ...user,
    id: user.id || user._id,
  }
}

function normalizeClub(club) {
  return {
    ...club,
    id: club.id || club._id,
  }
}

function normalizeEvent(event) {
  if (!event) return null

  return {
    ...event,
    id: event.id || event._id,
    clubId: event.clubId?.id || event.clubId?._id || event.clubId,
    creatorId: event.creatorId?.id || event.creatorId?._id || event.creatorId,
    highlights: Array.isArray(event.highlights) ? event.highlights : [],
  }
}

function normalizeRegistration(registration) {
  if (!registration) return null

  return {
    ...registration,
    id: registration.id || registration._id,
    userId: registration.userId?.id || registration.userId?._id || registration.userId,
    eventId: registration.eventId?.id || registration.eventId?._id || registration.eventId,
  }
}

async function request(path, options = {}) {
  const token = getToken()

  const headers = {
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`)
  }

  return data
}

export const api = {
  async login({ email, password, role }) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    })

    localStorage.setItem(TOKEN_KEY, data.token)

    return normalizeUser(data)
  },

  async signup(payload) {
    const data = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    localStorage.setItem(TOKEN_KEY, data.token)

    return normalizeUser(data)
  },

  async me() {
    const data = await request('/auth/me')
    return normalizeUser(data)
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
  },

  async getEvents() {
    const data = await request('/events')
    return data.map(normalizeEvent)
  },

  async getClubs() {
    const data = await request('/clubs')
    return data.map(normalizeClub)
  },

  async getRegistrations() {
    const data = await request('/registrations')
    return data.map(normalizeRegistration)
  },

  async registerForEvent(eventId) {
    const data = await request('/registrations', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    })

    return normalizeRegistration(data)
  },

  async createEvent(event) {
    const data = await request('/events', {
      method: 'POST',
      body: event instanceof FormData ? event : JSON.stringify(event),
    })

    return normalizeEvent(data)
  },

  async updateEvent(id, event) {
    const data = await request(`/events/${id}`, {
      method: 'PUT',
      body: event instanceof FormData ? event : JSON.stringify(event),
    })

    return normalizeEvent(data)
  },

  async deleteEvent(id) {
    return request(`/events/${id}`, {
      method: 'DELETE',
    })
  },

  async updateEventStatus(id, status) {
    const data = await request(`/events/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })

    return normalizeEvent(data)
  },

  async updateProfile(profile) {
    const data = await request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    })

    return normalizeUser(data)
  },
}
