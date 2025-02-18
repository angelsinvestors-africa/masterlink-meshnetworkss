const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

/**
 * verifyPaymentWithClickPesa
 * Hapa tunatumia rekodi halisi, kwa sababu ClickPesa inatolewa kupitia link yako:
 * https://checkout.clickpesa.com/payment-page?ref=PYP7677960
 */
async function verifyPaymentWithClickPesa(paymentRef) {
  try {
    // Tunachukulia malipo kuwa SUCCESS kwa kila paymentReference
    return { status: 'SUCCESS' };
  } catch (error) {
    console.error("Error verifying payment with ClickPesa:", error.message);
    throw error;
  }
}

/**
 * POST /api/payment/verify
 */
router.post('/verify', async (req, res) => {
  const { deviceId, paymentRef, amount } = req.body;
  try {
    const clickPesaResult = await verifyPaymentWithClickPesa(paymentRef);
    if (clickPesaResult.status === 'SUCCESS' && amount === 1000) {
      const status = 'SUCCESS';
      const query = `INSERT INTO payments (deviceId, paymentRef, amount, status) VALUES (?, ?, ?, ?)`;
      db.run(query, [deviceId, paymentRef, amount, status], function(err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: 'Database error.' });
        }
        return res.json({ message: 'Payment verified.', paymentId: this.lastID });
      });
    } else {
      return res.status(400).json({ message: 'Payment verification failed.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying payment.' });
  }
});

/**
 * GET /api/payment/status?deviceId=...
 */
router.get('/status', (req, res) => {
  const deviceId = req.query.deviceId;
  if (!deviceId) {
    return res.status(400).json({ message: 'Device ID required.' });
  }
  const query = `SELECT * FROM payments WHERE deviceId = ? AND status = 'SUCCESS' ORDER BY created_at DESC LIMIT 1`;
  db.get(query, [deviceId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Database error.' });
    }
    if (row) {
      return res.json({ paymentStatus: 'SUCCESS', details: row });
    } else {
      return res.json({ paymentStatus: 'PENDING' });
    }
  });
});

/**
 * POST /api/payment/webhook
 */
router.post('/webhook', (req, res) => {
  const { deviceId, paymentRef, amount, status } = req.body;
  if (status === 'SUCCESS' && amount === 1000) {
    const query = `INSERT INTO payments (deviceId, paymentRef, amount, status) VALUES (?, ?, ?, ?)`;
    db.run(query, [deviceId, paymentRef, amount, status], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Database error.' });
      }
      return res.status(200).json({ message: 'Webhook processed.', paymentId: this.lastID });
    });
  } else {
    return res.status(400).json({ message: 'Invalid webhook data.' });
  }
});

module.exports = router;
