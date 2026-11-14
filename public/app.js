async function initMode() {
  const res = await fetch('/api/mode');
  const { searchButtonLabel } = await res.json();
  document.getElementById('search-submit').textContent = searchButtonLabel;
}

function renderResults(properties) {
  const container = document.getElementById('search-results');
  container.innerHTML = '';

  if (!properties.length) {
    container.innerHTML = '<p data-testid="no-results">No properties found for that destination.</p>';
    return;
  }

  for (const property of properties) {
    const cheapestRoom = property.rooms.reduce((a, b) => (a.rate < b.rate ? a : b));

    const card = document.createElement('article');
    card.className = 'property-card';
    card.setAttribute('data-testid', 'property-card');
    card.innerHTML = `
      <h2 data-testid="property-name">${property.name}</h2>
      <p class="address">${property.address}</p>
      <p>${cheapestRoom.type} — <span data-testid="nightly-rate">₹${cheapestRoom.rate.toLocaleString('en-IN')}/night</span></p>
      <a href="rooms.html?propertyId=${property.id}" data-testid="view-rooms-link">View rooms</a>
    `;
    container.appendChild(card);
  }
}

document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const destination = document.getElementById('destination').value;
  const params = new URLSearchParams({ city: destination });
  const res = await fetch(`/api/properties?${params.toString()}`);
  const { properties } = await res.json();
  renderResults(properties);
});

initMode();
