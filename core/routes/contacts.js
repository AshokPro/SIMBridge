const express = require('express');
const router = express.Router();

const { createContact, getAllContacts } = require('../models/contactModel');

// Simple phone validation
function sanitizePhone(phone) {
  return phone.replace(/\D/g, '');
}

router.post('/', (req, res) => {
  let { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  name = name.trim();
  phone = sanitizePhone(phone);

  if (phone.length < 10 || phone.length > 15) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  try {
    createContact(name, phone);
    res.json({ success: true });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

router.get('/', (req, res) => {
  const contacts = getAllContacts();
  res.json(contacts);
});

module.exports = router;