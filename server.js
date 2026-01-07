const ts = require('typescript');
const { WebSocketServer } = require('ws');

// Initialize server on port 8080
const wss = new WebSocketServer({ port: 8080 });

const Feeds = ['News', 'Market', 'Price'];

const Titles = {
    News: ["Central Bank Announcement", "Tech Sector Growth", "Regulatory Update"],
    Market: ["High Volume Alert", "Volatility Spike", "Liquidity Warning"],
    Price: ["BTC/USD +5%", "TSLA Breakdown", "Gold Spot Hit Resistance"]
};

console.log("WebSocket running on ws://localhost:8080");

wss.on('connection', (ws) => {
    console.log("Client connected. Starting event stream...");

    const sendEvent = () => {
        // Determine if this should be a duplicate
        const isDuplicate = Math.random() < 0.2; // 20% chance of duplicate
        const id = isDuplicate ? "constant-id-123" : Math.random().toString(36).substring(2, 11);

        // pick a randodm feed category
        const feed = Feeds[Math.floor(Math.random() * Feeds.length)];

        // pick a title from that spesific category
        const options = Titles[feed];
        const title = options[Math.floor(Math.random() * options.length)];

        const event = {
            id,
            feed,
            ts: Date.now(),
            title: isDuplicate ? `[Duplicate] ${title}` : title,
            body: `Detailed update for ${feed} at ${new Date().toLocaleTimeString()}.` 
        };

        // send the JSON string
        if(ws.readyState === 1 ){ // 1 = Connected
            ws.send(JSON.stringify(event));
        }
    };

    // send an event every 2 seconds
    const interval = setInterval(sendEvent, 2000);

    ws.on('close', () => {
        console.log("Client Disconnected.");
        clearInterval(interval);
    });

    ws.on('error', (err) => {
        console.error("WebSocket Error:", err.message);
    })
})