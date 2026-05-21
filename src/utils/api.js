/**
 * AI Image Generator API Utilities
 * 
 * Uses a hybrid approach:
 * 1. Demo Mode: Lorem Picsum with prompt-based seeding (no API key, works instantly)
 * 2. Real AI Mode: Pollinations.ai via backend proxy (requires API key)
 * 
 * Lorem Picsum is a free service providing beautiful Unsplash photos.
 * The seed parameter ensures consistent images for the same prompt.
 */

const PICSUM_BASE = 'https://picsum.photos'
const POLLINATIONS_BASE = 'https://gen.pollinations.ai/image'

// Generate a numeric seed from a string (prompt)
function stringToSeed(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Generate an image URL from a prompt
 * @param {Object} options - Generation options
 * @param {string} options.prompt - The image description
 * @param {string} options.model - Model (affects style in demo mode)
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @param {number} options.seed - Seed for reproducibility
 * @param {boolean} options.useRealAI - Whether to use real AI (requires API key)
 * @param {string} options.apiKey - API key for real AI mode
 * @returns {string} The image URL
 */
export function generateImageUrl({
  prompt,
  model = 'flux',
  width = 1024,
  height = 1024,
  seed,
  useRealAI = false,
  apiKey = '',
}) {
  // Real AI mode (requires API key)
  if (useRealAI && apiKey) {
    const encodedPrompt = encodeURIComponent(prompt)
    const params = new URLSearchParams()
    params.append('model', model)
    params.append('width', width.toString())
    params.append('height', height.toString())
    if (seed) params.append('seed', seed.toString())
    params.append('nologo', 'true')
    params.append('key', apiKey)
    return `${POLLINATIONS_BASE}/${encodedPrompt}?${params.toString()}`
  }

  // Demo mode: Lorem Picsum with prompt-based seeding
  // This creates consistent, beautiful images for the same prompt
  const finalSeed = seed || stringToSeed(prompt)

  // Use seed to get consistent images for the same prompt
  // Add a timestamp to prevent browser caching issues
  const cacheBuster = Date.now()

  return `${PICSUM_BASE}/seed/${finalSeed}/${width}/${height}?random=${cacheBuster}`
}

/**
 * Download an image from a URL
 * @param {string} url - The image URL
 * @param {string} filename - The filename for download
 */
export async function downloadImage(url, filename = 'generated-image.png') {
  try {
    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) throw new Error('Network response was not ok')

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(blobUrl)
    return true
  } catch (error) {
    console.error('Download failed:', error)
    // Fallback: open in new tab
    window.open(url, '_blank')
    return false
  }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Copy failed:', error)
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

/**
 * Fetch a list of images from Lorem Picsum API
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Array>} List of image metadata
 */
export async function fetchImageList(page = 1, limit = 30) {
  try {
    const response = await fetch(`${PICSUM_BASE}/v2/list?page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch image list')
    return await response.json()
  } catch (error) {
    console.error('Error fetching image list:', error)
    return []
  }
}

/**
 * Preload an image to ensure it's ready before displaying
 * @param {string} url - Image URL to preload
 * @returns {Promise<HTMLImageElement>}
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}
