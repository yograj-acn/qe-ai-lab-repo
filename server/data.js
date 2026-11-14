// Seeded property and room data for the Breezewood Hotels training app.
const PROPERTIES = [
  {
    id: 'BLR-001',
    city: 'Bengaluru',
    name: 'Breezewood Residency Bengaluru',
    address: '221 MG Road, Bengaluru, Karnataka 560001',
    rooms: [
      { id: 'RM-101', type: 'Deluxe King Room', rate: 7500, currency: 'INR', available: true },
      { id: 'RM-102', type: 'Executive Suite', rate: 11200, currency: 'INR', available: true },
    ],
  },
];

// Seeded stay dates and synthetic guest used by the manual test cases.
const SEEDED_STAY = {
  checkIn: '2026-12-10',
  checkOut: '2026-12-12',
};

const SEEDED_GUEST = {
  name: 'Asha Rao',
  email: 'asha.rao@example.com',
  phone: '+91-9876543210',
};

module.exports = { PROPERTIES, SEEDED_STAY, SEEDED_GUEST };
