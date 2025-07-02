const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Main page - no special headers needed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Vulnerable page - intentionally NO security headers
app.get('/vulnerable-page.html', (req, res) => {
    // Deliberately omitting security headers to demonstrate vulnerability
    res.sendFile(path.join(__dirname, 'vulnerable-page.html'));
});

// Protected page - with security headers
app.get('/protected-page.html', (req, res) => {
    // Add security headers to prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    const protectedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Protected Banking Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, #00b894, #00cec9);
            color: white;
            text-align: center;
        }
        .bank-interface {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            max-width: 400px;
            margin: 0 auto;
        }
        h1 {
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .protection-info {
            background: rgba(0,255,0,0.2);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px solid rgba(0,255,0,0.5);
        }
        .transfer-button {
            background: #00b894;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            border-radius: 25px;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s ease;
        }
        .transfer-button:hover {
            background: #00a085;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="bank-interface">
        <h1>🛡️ SecureBank Protected</h1>
        
        <div class="protection-info">
            <h3>✅ Clickjacking Protection Active</h3>
            <p>This page includes:</p>
            <ul style="text-align: left; margin: 10px 0;">
                <li>X-Frame-Options: DENY</li>
                <li>CSP: frame-ancestors 'none'</li>
                <li>X-Content-Type-Options: nosniff</li>
                <li>X-XSS-Protection: 1; mode=block</li>
            </ul>
        </div>
        
        <p>Protected Actions:</p>
        
        <button class="transfer-button" onclick="showProtected()">
            🔒 Secure Transfer
        </button>
        
        <div id="message" style="margin-top: 20px; padding: 10px; border-radius: 5px; display: none;">
            This page cannot be embedded in malicious iframes!
        </div>
    </div>

    <script>
        function showProtected() {
            const message = document.getElementById('message');
            message.style.display = 'block';
            message.style.background = 'rgba(0,255,0,0.3)';
            message.innerHTML = '🛡️ Protected action executed safely! This page cannot be used in clickjacking attacks.';
        }
    </script>
</body>
</html>`;
    
    res.send(protectedHTML);
});

// API endpoint for testing (used in DOM clobbering demo)
app.get('/api/data', (req, res) => {
    res.json({
        message: 'API endpoint accessed',
        timestamp: new Date().toISOString(),
        source: req.get('origin') || 'direct'
    });
});

// Middleware to log requests for educational purposes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Security Vulnerability Demonstration Server Started!

📍 Server running at: http://localhost:${PORT}
📁 Serving files from: ${__dirname}

🔍 Available endpoints:
  • Main Demo: http://localhost:${PORT}/
  • Vulnerable Page: http://localhost:${PORT}/vulnerable-page.html
  • Protected Page: http://localhost:${PORT}/protected-page.html
  • API Endpoint: http://localhost:${PORT}/api/data

⚠️  SECURITY NOTICE: This server contains intentionally vulnerable code for educational purposes.
    Do not use this code in production environments!

🛑 To stop the server: Ctrl+C
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Server shutting down gracefully...');
    process.exit(0);
});