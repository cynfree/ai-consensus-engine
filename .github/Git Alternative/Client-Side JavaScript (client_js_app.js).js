const analyzeBtn = document.getElementById('analyze-btn');
const problemInput = document.getElementById('problem-input');
const resultsSection = document.getElementById('results-section');
const statusMessage = document.getElementById('status-message');

const claudeResponseEl = document.getElementById('claude-response');
const gptResponseEl = document.getElementById('gpt-response');
const geminiResponseEl = document.getElementById('gemini-response');
const synthesisResponseEl = document.getElementById('synthesis-response');

const loadingSpinner = `<div class="flex justify-center items-center h-full"><div class="spinner"></div></div>`;

// API endpoint - using our server proxy instead of direct API calls
const API_ENDPOINT = '/api/gemini';

// Input validation
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

// Call our server API instead of direct Gemini API
async function callServerAPI(payload, maxRetries = 3) {
    let attempt = 0;
    let delay = 1000;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            if (result.text) {
                return result.text;
            } else {
                throw new Error("Invalid response structure from API.");
            }
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                let errorMessage = "Could not get a response.";
                
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    errorMessage = "Network error. Please check your connection.";
                } else if (error.message.includes('429')) {
                    errorMessage = "Rate limit exceeded. Please try again later.";
                } else if (error.message.includes('5')) {
                    errorMessage = "Server error. Please try again later.";
                }
                
                return `Error: ${errorMessage}`;
            }
            console.warn(`API call attempt ${attempt} failed. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}

// Generate response from a simulated AI persona
function simulatePersona(persona, userInput) {
    let systemInstruction;
    switch (persona) {
        case 'Claude':
            systemInstruction = "You are 'Claude', an AI persona focused on security, safety, and accessibility. Your reasoning is reliable and cautious. Analyze the following user problem from this perspective. Your response should prioritize risk mitigation, robustness, and clear, accessible solutions. Format your response in Markdown with lists and bold text for clarity.";
            break;
        case 'GPT':
            systemInstruction = "You are 'GPT', an AI persona focused on creative design and user experience. Your reasoning is innovative and user-centric. Analyze the following user problem from this perspective. Your response should prioritize novel ideas, elegant interfaces, and user-friendly workflows. Format your response in Markdown with lists and bold text for clarity.";
            break;
        case 'Gemini':
            systemInstruction = "You are 'Gemini', an AI persona focused on efficiency and optimization. Your reasoning is fast and practical. Analyze the following user problem from this perspective. Your response should prioritize performance, scalability, and pragmatic, resource-conscious solutions. Format your response in Markdown with lists and bold text for clarity.";
            break;
    }

    const payload = {
        contents: [{ parts: [{ text: userInput }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };
    return callServerAPI(payload);
}

// Generate a synthesized recommendation
function synthesizeMeta(userInput, responses) {
    const synthesisPrompt = `You are a meta-analysis AI. Your task is to synthesize the following three perspectives from different AI personas into a single, unified, and actionable recommendation. The personas are: Claude (security-focused), GPT (design-focused), and Gemini (efficiency-focused). 
    
    Analyze their outputs, identify convergences and divergences, and produce a balanced, practical final recommendation that considers the trade-offs. The recommendation should be clear, concise, and directly address the user's problem.

    The user's original problem was: "${userInput}"

    Here are the persona responses:
    ---
    CLAUDE (Security & Safety):
    ${responses.claude}
    ---
    GPT (Creative & UX):
    ${responses.gpt}
    ---
    GEMINI (Efficiency & Optimization):
    ${responses.gemini}
    ---

    Now, synthesize these into a final, unified recommendation. Format your response in Markdown. Start with a summary, then provide actionable steps.`;

    const payload = {
        contents: [{ parts: [{ text: synthesisPrompt }] }]
    };
    return callServerAPI(payload);
}

// Main application logic
analyzeBtn.addEventListener('click', async () => {
    const userInput = problemInput.value.trim();
    
    // Validate input
    const validation = validateInput(userInput);
    if (!validation.valid) {
        statusMessage.textContent = validation.message;
        statusMessage.style.color = '#ef4444';
        statusMessage.style.display = 'block';
        return;
    }

    // Reset UI
    resultsSection.style.display = 'block';
    statusMessage.style.display = 'block';
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';
    
    claudeResponseEl.innerHTML = loadingSpinner;
    gptResponseEl.innerHTML = loadingSpinner;
    geminiResponseEl.innerHTML = loadingSpinner;
    synthesisResponseEl.innerHTML = '';

    try {
        // Step 1 & 2: Activate personas and get responses concurrently
        statusMessage.textContent = 'Step 1/3: Activating personas...';
        const [claudeRes, gptRes, geminiRes] = await Promise.all([
            simulatePersona('Claude', userInput),
            simulatePersona('GPT', userInput),
            simulatePersona('Gemini', userInput)
        ]);
        
        // Step 3: Compare responses
        statusMessage.textContent = 'Step 2/3: Comparing responses...';
        claudeResponseEl.innerHTML = marked.parse(claudeRes);
        gptResponseEl.innerHTML = marked.parse(gptRes);
        geminiResponseEl.innerHTML = marked.parse(geminiRes);

        const responses = { claude: claudeRes, gpt: gptRes, gemini: geminiRes };

        // Step 4 & 5: Meta analysis and synthesis
        statusMessage.textContent = 'Step 3/3: Synthesizing recommendation...';
        synthesisResponseEl.innerHTML = loadingSpinner;
        const synthesisRes = await synthesizeMeta(userInput, responses);
        synthesisResponseEl.innerHTML = marked.parse(synthesisRes);

        statusMessage.style.display = 'none';

    } catch (error) {
        console.error("An error occurred during the analysis:", error);
        statusMessage.textContent = `An error occurred: ${error.message}`;
        statusMessage.style.color = '#ef4444';
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Synthesize Perspectives';
    }
});
