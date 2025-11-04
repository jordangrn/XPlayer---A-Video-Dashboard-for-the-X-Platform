// API service for XPlay backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Fetch all videos (normal + micros) from the backend
 */
export async function fetchVideos() {
  try {
    const response = await fetch(`${API_BASE_URL}/videos`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

/**
 * Search for videos by query
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results (default: 10)
 */
export async function searchVideos(query, maxResults = 10) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search/videos?query=${encodeURIComponent(query)}&maxResults=${maxResults}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
}

/**
 * Fetch a specific tweet by ID
 * @param {string} tweetId - Tweet ID
 */
export async function fetchTweetById(tweetId) {
  try {
    const response = await fetch(`${API_BASE_URL}/tweet/${tweetId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tweet:', error);
    throw error;
  }
}

/**
 * Check backend health
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
}
