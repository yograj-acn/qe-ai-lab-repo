const express = require('express');
const path = require('path');
const { PROPERTIES, SEEDED_STAY, SEEDED_GUEST } = require('./data');

const VALID_MODES = ['baseline', 'ui-change', 'booking-defect'];
const MODE = VALID_MODES.includes(process.env.APP_MODE) ? process.env.APP_MODE : 'baseline';

if (process.env.APP_MODE && !VALID_MODES.includes(process.env.APP_MODE)) {
  console.warn(`Unknown APP_MODE "${process.env.APP_MODE}", falling back to "baseline".`);
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Lets the frontend render the mode-dependent search button label and
// lets Playwright scripts confirm which mode the app is running in.
app.get('/api/mode', (req, res) => {
  res.json({
    mode: MODE,
    searchButtonLabel: MODE === 'ui-change' ? 'Find hotels' : 'Search hotels',
    seededStay: SEEDED_STAY,
    seededGuest: SEEDED_GUEST,
  });
});

app.get('/api/properties', (req, res) => {
  const city = (req.query.city || '').toString().trim().toLowerCase();
  const properties = city ? PROPERTIES.filter((p) => p.city.toLowerCase().includes(city)) : [];
  res.json({ properties });
});

app.get('/api/properties/:id', (req, res) => {
  const property = PROPERTIES.find((p) => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found.' });
  }
  res.json({ property });
});

app.post('/api/book', (req, res) => {
  // In Booking Defect mode the reservation endpoint always fails, regardless
  // of the payload, so the guest never receives a confirmation number.
  if (MODE === 'booking-defect') {
    return res.status(500).json({
      error: 'We could not complete your reservation. Please try again in a few minutes.',
    });
  }

  const { propertyId, roomId, guest, checkIn, checkOut } = req.body || {};
  const property = PROPERTIES.find((p) => p.id === propertyId);
  const room = property && property.rooms.find((r) => r.id === roomId);

  if (!property || !room) {
    return res.status(400).json({ error: 'Invalid property or room selection.' });
  }
  if (!guest || !guest.name || !guest.email) {
    return res.status(400).json({ error: 'Guest name and email are required.' });
  }

  const reservationNumber = `BWR-${Math.floor(100000 + Math.random() * 900000)}`;
  res.json({
    reservationNumber,
    propertyId: property.id,
    propertyName: property.name,
    roomId: room.id,
    roomType: room.type,
    checkIn,
    checkOut,
    guest,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Breezewood Hotels running in "${MODE}" mode at http://localhost:${PORT}`);
});
