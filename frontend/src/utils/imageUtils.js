import { BASE_URL } from '../services/api';

export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1520974735194-6b1f1f5f4f63?w=800&h=1000&fit=crop&auto=format&q=80';

/**
 * Resolves a product image path to a full URL.
 * Handles external URLs, local relative paths, and provides a fallback.
 * @param {string} path - The image path or URL from the database
 * @returns {string} - The full URL to the image
 */
export const getImageUrl = (path) => {
  if (!path) return FALLBACK_IMAGE;

  // If it's already a full URL or a data URL (base64 preview), return it as is
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // If it's a relative path, prefix it with the backend BASE_URL
  // Ensure we don't have double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Some versions of the backend might already include /api in the path or expect it
  // But usually /images is served from the root of the express app
  // In index.js: app.use('/images', express.static(path.join(publicDir, 'images')));
  // So BASE_URL (http://localhost:5000) + /images/... is correct.
  return `${BASE_URL.replace(/\/api$/, '')}${cleanPath}`;
};

const imageUtils = {
  getImageUrl,
  FALLBACK_IMAGE,
};

export default imageUtils;
