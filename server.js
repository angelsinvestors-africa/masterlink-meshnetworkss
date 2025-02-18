const express = require('express');
const app = express();
const paymentRoutes = require('./routes/payment');
const PORT = process.env.PORT || 3000;

app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Mesh Network Internet Sharing Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
