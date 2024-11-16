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
  // Check if the lock status is 'Alerted'
  res.json({
    lockStatus: lockStatus.status,
    alertMessage: lockStatus.alertMessage,
  });
});

// API endpoint to set the lock status to 'Alerted' when more than 3 failed attempts are detected by the ESP32
app.post('/api/alert', (req, res) => {
  const { alert } = req.body; // Expecting a body with an 'alert' property
  if (alert) {
    lockStatus.status = 'Alerted';  // Change lock status to 'Alerted'
    lockStatus.alertMessage = 'Alert: Too many failed password attempts!';
    return res.json({
      message: 'Alert triggered, lock status changed to Alerted.',
    });
  } else {
    lockStatus.status = 'Locked';  // Change lock status back to 'Locked'
    lockStatus.alertMessage = '';  // Clear the alert message
    return res.json({
      message: 'Lock status reset to Locked.',
    });
  }
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
