// Server-side (Node.js/Express example)
app.post('/api/gemini', async (req, res) => {
    const API_KEY = process.env.GEMINI_API_KEY; // Store in environment variables
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
});
