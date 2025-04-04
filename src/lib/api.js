import axios from 'axios'

const API_BASE_URL = process.env.APP_API_BASE_URL

export const registerUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
            email,
            password,
        })
        return response.data
    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data)
            throw new Error(error.response.data.message || 'Registration failed') 
        } else if (error.request) {
            console.error('API Error: No response received', error.request)
            throw new Error('Network error. Please try again.') 
        } else {
            console.error('API Error:', error.message)
            throw new Error('An unexpected error occurred.')
        }
    }
}

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password,
        })
        return response.data
    } catch (error) {
        
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data)
            throw new Error(error.response.data.message || 'Login failed')
        } else if (error.request) {
            console.error('API Error: No response received', error.request)
            throw new Error('Network error. Please try again.')
        } else {
            console.error('API Error:', error.message)
            throw new Error('An unexpected error occurred.')
        }
    }
}

export const createEvent = async (name, date, time, location, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/events`,
            {
                name,
                date,
                time,
                location,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return response.data
    } catch (error) {
        
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data)
            throw new Error(error.response.data.message || 'Event creation failed')
        } else if (error.request) {
            console.error('API Error: No response received', error.request)
            throw new Error('Network error. Please try again.')
        } else {
            console.error('API Error:', error.message)
            throw new Error('An unexpected error occurred.')
        }
    }
}

export const getEvents = async (userId) => {
    try {
        const token = localStorage.getItem("jwt") 
        const response = await axios.get(`${API_BASE_URL}/events`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        })
        return response.data
    } catch (error) {
        
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data)
            throw new Error(error.response.data.message || "Failed to fetch events")
        } else if (error.request) {
            console.error("API Error: No response received", error.request)
            throw new Error("Network error. Please try again.")
        } else {
            console.error("API Error:", error.message)
            throw new Error("An unexpected error occurred.")
        }
    }
}


export const updateEvent = async (eventId, token, updatedEventData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/events/${eventId}`, updatedEventData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data)
            throw new Error(error.response.data.message || 'Failed to update event')
        } else if (error.request) {
            console.error('API Error: No response received', error.request)
            throw new Error('Network error. Please try again.')
        } else {
            console.error('API Error:', error.message)
            throw new Error('An unexpected error occurred.')
        }
    }
}

export const deleteEvent = async (eventId, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data)
            throw new Error(error.response.data.message || 'Failed to delete event')
        } else if (error.request) {
            console.error('API Error: No response received', error.request)
            throw new Error('Network error. Please try again.')
        } else {
            console.error('API Error:', error.message)
            throw new Error('An unexpected error occurred.')
        }
    }
}


export const getGuests = async (eventId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events/${eventId}/guests`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data)
            throw new Error(error.response.data.message || 'Failed to fetch guests')
        } else if (error.request) {
            console.error('API Error: No response received', error.request)
            throw new Error('Network error. Please try again.')
        } else {
            console.error('API Error:', error.message)
            throw new Error('An unexpected error occurred.')
        }
    }
}


export const inviteGuest = async (inviteData, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/events/guests`, inviteData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data)
            throw new Error(error.response.data.message || "Failed to invite guest")
        } else if (error.request) {
            console.error("API Error: No response received", error.request)
            throw new Error("Network error. Please try again.")
        } else {
            console.error("API Error:", error.message)
            throw new Error("An unexpected error occurred.")
        }
    }
}



export const rsvpGuest = async (token, rsvpStatus) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/events/rsvp/${token}`, { rsvpStatus: rsvpStatus })
        return response.data
    } catch (error) {
        
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data)
            throw new Error(error.response.data.message || "Failed to update RSVP status")
        } else if (error.request) {
            console.error("API Error: No response received", error.request)
            throw new Error("Network error. Please try again.")
        } else {
            console.error("API Error:", error.message)
            throw new Error("An unexpected error occurred.")
        }
    }
}


export const getRsvpPage = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events/rsvp/${token}`)
        return response.data
    } catch (error) {
        
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data)
            throw new Error(error.response.data.message || "Failed to fetch RSVP details")
        } else if (error.request) {
            console.error("API Error: No response received", error.request)
            throw new Error("Network error. Please try again.")
        } else {
            console.error("API Error:", error.message)
            throw new Error("An unexpected error occurred.")
        }
    }
}