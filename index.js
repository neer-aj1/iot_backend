const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Use CORS middleware to allow cross-origin requests from the frontend
app.use(cors());
app.use(express.json());

// Mock lock status
let lockStatus = {
  engaged: true,  // true means the lock is engaged (locked), false means it is unlocked
  status: 'Locked', // Initial status of the lock
  alertMessage: '', // Message to alert the user if there are too many failed attempts
};

// API endpoint to get the lock status
app.get('/api/status', (req, res) => {
  res.json({
    lockStatus: lockStatus.status,
    alertMessage: lockStatus.alertMessage,
  });
});

// API endpoint to trigger the alert when there are multiple failed attempts
app.post('/api/alert', (req, res) => {
  lockStatus.status = 'Alerted';  // Change the lock status to 'Alerted'
  lockStatus.alertMessage = 'Alert: Too many failed password attempts!';
  res.json({
    message: 'Alert triggered, lock status changed to Alerted.',
  });
});

// API endpoint to lock the lock
app.post('/api/lock', (req, res) => {
  lockStatus.status = 'Locked';  // Change the lock status to 'Locked'
  lockStatus.alertMessage = '';  // Clear any alert message
  res.json({
    message: 'Lock status changed to Locked.',
  });
});

// API endpoint to unlock the lock
app.post('/api/unlock', (req, res) => {
  lockStatus.status = 'Unlocked';  // Change the lock status to 'Unlocked'
  lockStatus.alertMessage = '';  // Clear any alert message
  res.json({
    message: 'Lock status changed to Unlocked.',
  });
});

// Route to display backend status (for testing or monitoring purposes)
app.get('/', (req, res) => {
  res.send(`
    <h1>Smart Lock Backend</h1>
    <p>Lock Status: ${lockStatus.status}</p>
    <p>Alert Message: ${lockStatus.alertMessage}</p>
    <p><a href="/api/status">Check lock status via API</a></p>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
