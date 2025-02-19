export default async function handler(req, res) {
    const url = 'https://clerk.gservetech.com/npm/@clerk/clerk-js@5/dist/clerk.browser.js';

    try {
        const response = await fetch(url);
        const text = await response.text();

        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', 'https://www.gservetech.com');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Content-Type', 'application/javascript');

        // Send the fetched resource
        res.status(200).send(text);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resource', details: error.message });
    }
}
