// Add more specific error handling for different scenarios
catch (error) {
    let errorMessage = "An unknown error occurred.";
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection.";
    } else if (error.status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
    } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
    }
    
    statusMessage.textContent = errorMessage;
    statusMessage.style.color = '#ef4444';
}
