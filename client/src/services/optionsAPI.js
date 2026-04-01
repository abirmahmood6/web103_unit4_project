const API_BASE_URL = 'http://localhost:3000/api'

export const getExteriorColors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/options/exterior-colors`)
    if (!response.ok) {
      throw new Error('Failed to fetch exterior colors')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching exterior colors:', error)
    throw error
  }
}

export const getWheels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/options/wheels`)
    if (!response.ok) {
      throw new Error('Failed to fetch wheels')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching wheels:', error)
    throw error
  }
}

export const getRoofs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/options/roofs`)
    if (!response.ok) {
      throw new Error('Failed to fetch roofs')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching roofs:', error)
    throw error
  }
}

export const getEngines = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/options/engines`)
    if (!response.ok) {
      throw new Error('Failed to fetch engines')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching engines:', error)
    throw error
  }
}