// config.js
// Configuration for both development and production environments
export const CONFIG = {
  // Determine if we're in development or production
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Base URL for assets and API calls
  get baseUrl() {
    return this.isDevelopment ? 'https://localhost:3003' : '';
  },
  
  // Helper function to get full URL for assets
  getAssetUrl(path) {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    let fullUrl;
    
    if (this.isDevelopment) {
      fullUrl = `${this.baseUrl}/${cleanPath}`;
      console.log(`[CONFIG] Asset URL (dev): ${cleanPath} -> ${fullUrl}`);
    } else {
      // In production, check if it's an Excel file that should come from GitHub
      const filename = cleanPath.split('/').pop();
      if (filename.endsWith('.xlsx')) {
        // URL-encode the filename to handle spaces
        const encodedFilename = encodeURIComponent(filename);
        fullUrl = `https://raw.githubusercontent.com/Judefinisterra/EBITDAI-Assets/main/${encodedFilename}`;
        console.log(`[CONFIG] Excel file URL (prod): ${cleanPath} -> ${fullUrl}`);
      } else {
        // For other assets, use relative path
        fullUrl = `./${cleanPath}`;
        console.log(`[CONFIG] Asset URL (prod): ${cleanPath} -> ${fullUrl}`);
      }
    }
    
    return fullUrl;
  },

  // Helper function to get multiple possible asset URLs for fallback
  getAssetUrlsWithFallback(path) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    if (this.isDevelopment) {
      return [`${this.baseUrl}/${cleanPath}`];
    } else {
      // In production, check if it's an Excel file
      const filename = cleanPath.split('/').pop();
      if (filename.endsWith('.xlsx')) {
        // For Excel files, use GitHub public repo with URL-encoded filename
        const encodedFilename = encodeURIComponent(filename);
        return [`https://raw.githubusercontent.com/Judefinisterra/EBITDAI-Assets/main/${encodedFilename}`];
      } else {
        // For other assets, try multiple possible paths
        return [
          `./${cleanPath}`,           // Relative to current page
          `/${cleanPath}`,            // Absolute from root
          `_next/static/${cleanPath}`, // Next.js static folder
          `assets/${cleanPath.replace('assets/', '')}`, // Direct assets folder
        ];
      }
    }
  },
  
  // Helper function to get prompt URL
  getPromptUrl(filename) {
    return this.isDevelopment 
      ? `https://localhost:3003/prompts/${filename}`
      : `./prompts/${filename}`;
  },

  // Backend API Configuration - REMOVED
  // All backend communication has been removed
};
// Log configuration on load (for debugging)
// Only log after Office is ready or if running outside of Office context
if (typeof Office !== 'undefined' && Office.onReady) {
  Office.onReady(() => {
    console.log('🔗 ========================================');
    console.log('🔗 CONFIG LOADED - Standalone mode (no backend)');
    console.log(`🔗 Environment: ${CONFIG.isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
    console.log('🔗 ========================================');
    
    if (CONFIG.isDevelopment) {
      console.log('Config loaded:', {
        isDevelopment: CONFIG.isDevelopment,
        baseUrl: CONFIG.baseUrl
        // Backend removed - standalone mode
      });
    }
  });
} else {
  // For non-Office contexts (like tests)
  console.log('🔗 CONFIG LOADED - Standalone mode (no backend)');
  console.log(`🔗 Environment: ${CONFIG.isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
}

