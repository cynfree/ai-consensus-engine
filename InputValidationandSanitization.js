// Add input validation before processing
function validateInput(userInput) {
    if (!userInput || typeof userInput !== 'string') {
        return { valid: false, message: "Please enter valid text." };
    }
    if (userInput.length > 5000) {
        return { valid: false, message: "Input too long. Please keep it under 5000 characters." };
    }
    if (userInput.includes('<script')) {
        return { valid: false, message: "Invalid input detected." };
    }
    return { valid: true };
}

// Then in your click handler:
const validation = validateInput(userInput);
if (!validation.valid) {
    statusMessage.textContent = validation.message;
    statusMessage.style.color = '#ef4444';
    return;
}
