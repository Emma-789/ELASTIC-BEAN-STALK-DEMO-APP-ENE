const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8080;

// Landing page with live instance info
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Elastic Beanstalk Demo App</title></head>
      <body style="font-family: sans-serif; padding: 40px;">
        <h1>Elastic Beanstalk Demo App</h1>
        <p>This app is running and serving live instance information.</p>
        <ul>
          <li><strong>Hostname:</strong> ${os.hostname()}</li>
          <li><strong>Platform:</strong> ${os.platform()}</li>
          <li><strong>Uptime (seconds):</strong> ${Math.floor(process.uptime())}</li>
          <li><strong>Node version:</strong> ${process.version}</li>
          <li><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
          <li><strong>Server time:</strong> ${new Date().toISOString()}</li>
        </ul>
        <p>Try the API endpoints: <code>/api/info</code> and <code>/health</code></p>
      </body>
    </html>
  `);
});

// Health check endpoint (used in the README's "Setting the Health Check Path" step)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Example API endpoint returning instance info as JSON
app.get('/api/info', (req, res) => {
  res.json({
    hostname: os.hostname(),
    platform: os.platform(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
