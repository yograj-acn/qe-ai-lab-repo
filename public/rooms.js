const params = new URLSearchParams(window.location.search);
const propertyId = params.get('propertyId');

let selectedRoomId = null;
let seededStay = { checkIn: '', checkOut: '' };

async function loadMode() {
  const res = await fetch('/api/mode');
  const { seededStay: stay } = await res.json();
  seededStay = stay;
}

async function loadProperty() {
  const res = await fetch(`/api/properties/${propertyId}`);
  if (!res.ok) {
    document.getElementById('property-title').textContent = 'Property not found';
    return;
  }

  const { property } = await res.json();
  document.getElementById('property-title').textContent = property.name;
  document.getElementById('property-address').textContent = property.address;

  const roomList = document.getElementById('room-list');
  roomList.innerHTML = '';

  for (const room of property.rooms) {
    const row = document.createElement('div');
    row.className = 'room-row';
    row.innerHTML = `
      <span>${room.type} — ₹${room.rate.toLocaleString('en-IN')}/night</span>
      <button type="button" data-testid="select-room-${room.id}" ${room.available ? '' : 'disabled'}>
        ${room.available ? 'Select' : 'Unavailable'}
      </button>
    `;
    row.querySelector('button').addEventListener('click', () => selectRoom(room.id));
    roomList.appendChild(row);
  }
}

function selectRoom(roomId) {
  selectedRoomId = roomId;
  const guestSection = document.getElementById('guest-section');
  guestSection.hidden = false;
  guestSection.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('guest-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const guest = {
    name: document.getElementById('guest-name').value,
    email: document.getElementById('guest-email').value,
    phone: document.getElementById('guest-phone').value,
  };

  const res = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      propertyId,
      roomId: selectedRoomId,
      guest,
      checkIn: seededStay.checkIn,
      checkOut: seededStay.checkOut,
    }),
  });

  const errorPanel = document.getElementById('booking-error');
  const confirmationPanel = document.getElementById('confirmation-panel');

  if (!res.ok) {
    const { error } = await res.json();
    errorPanel.hidden = false;
    errorPanel.querySelector('[role="alert"]').textContent = error;
    confirmationPanel.hidden = true;
    return;
  }

  const booking = await res.json();
  errorPanel.hidden = true;
  confirmationPanel.hidden = false;
  confirmationPanel.querySelector('[data-testid="reservation-number"]').textContent = booking.reservationNumber;
  confirmationPanel.querySelector('[data-testid="confirmation-property-name"]').textContent = booking.propertyName;
  confirmationPanel.querySelector('[data-testid="confirmation-dates"]').textContent =
    `${booking.checkIn} to ${booking.checkOut}`;
});

loadMode().then(loadProperty);
