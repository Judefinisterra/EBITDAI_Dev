/**
 * Main Application Controller
 * Handles view management and Office.js initialization
 */

// Global app object
window.app = {
    viewLoader: null,
    currentView: null,
    isOfficeInitialized: false
};

// Initialize Office - DISABLED for direct developer mode
// Office.onReady is handled in main taskpane.js
console.log('🚀 app.js - Office.onReady disabled, using main taskpane.js handler');

/**
 * Determine which view to load initially
 * @returns {string} View name to load
 */
function determineInitialView() {
    // Always return developer mode - bypass all checks
    console.log('🚀 Bypassing all checks - going to developer mode');
    return 'developer-mode';
}

// Authentication removed - always return true
function checkAuthentication() {
    return true;
}

/**
 * Check if user has given valid data sharing consent
 * @returns {boolean}
 */
function checkDataSharingConsent() {
    const storedConsent = localStorage.getItem('data_sharing_consent');
    
    if (!storedConsent) return false;
    
    try {
        const consentData = JSON.parse(storedConsent);
        
        // Check if consent is still valid (within last 365 days)
        const consentDate = new Date(consentData.timestamp);
        const daysSinceConsent = (new Date() - consentDate) / (1000 * 60 * 60 * 24);
        
        return consentData.version === '1.0' && daysSinceConsent <= 365;
    } catch (error) {
        console.error('Error parsing consent data:', error);
        return false;
    }
}

/**
 * Load a specific view
 * @param {string} viewName - Name of the view to load
 */
app.loadView = async function(viewName) {
    try {
        // Show loading state
        showLoadingState();
        
        // Load the view
        await app.viewLoader.loadView(viewName);
        
        // Update current view
        app.currentView = viewName;
        
        // Save to local storage
        localStorage.setItem('lastView', viewName);
        
        // Hide loading state
        hideLoadingState();
        
        // Fire view loaded event
        fireViewLoadedEvent(viewName);
        
    } catch (error) {
        console.error('Error loading view:', error);
        showErrorState(error.message);
    }
};

/**
 * Show loading state
 */
function showLoadingState() {
    const container = document.getElementById('main-container');
    container.classList.add('loading');
    
    // Optionally show a loading spinner
    const loadingHtml = `
        <div class="loading-overlay">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    // Only show spinner if loading takes more than 200ms
    app.loadingTimeout = setTimeout(() => {
        if (!document.querySelector('.loading-overlay')) {
            container.insertAdjacentHTML('beforeend', loadingHtml);
        }
    }, 200);
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    clearTimeout(app.loadingTimeout);
    
    const container = document.getElementById('main-container');
    container.classList.remove('loading');
    
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

/**
 * Show error state
 * @param {string} message - Error message to display
 */
function showErrorState(message) {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="error-state">
            <h2>Error Loading View</h2>
            <p>${message}</p>
            <button onclick="app.loadView('authentication')">Return to Home</button>
        </div>
    `;
}

/**
 * Fire custom event when view is loaded
 * @param {string} viewName - Name of the loaded view
 */
function fireViewLoadedEvent(viewName) {
    const event = new CustomEvent('viewLoaded', {
        detail: { viewName }
    });
    document.dispatchEvent(event);
}

// Global navigation functions
app.goBack = function() {
    app.loadView('client-mode');
};

// Sign out functionality removed - no authentication
app.signOut = function() {
    console.log('Sign out called - no action needed in standalone mode');
};

// Export for use in modules
window.app = app;

