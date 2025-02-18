const express = require('express');
const app = express();
const paymentRoutes = require('./routes/payment');

// Badilisha PORT kuwa APP_PORT
const PORT = process.env.APP_PORT || 3000;

app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Mesh Network Internet Sharing Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
