// Electricity Calculator with Enable/Disable Devices

const presets = [
  { id: 'led', name: 'LED bulb', watts: 9, hours: 4, enabled: false },
  { id: 'fan', name: 'Ceiling fan', watts: 60, hours: 6, enabled: true },
  { id: 'fridge', name: 'Refrigerator (avg)', watts: 150, hours: 24, enabled: true },
  { id: 'tv', name: 'TV (LED)', watts: 100, hours: 4, enabled: true },
  { id: 'laptop', name: 'Laptop', watts: 50, hours: 6, enabled: true },
  { id: 'pc', name: 'Desktop PC', watts: 200, hours: 4, enabled: true },
  { id: 'washing', name: 'Washing machine', watts: 500, hours: 1, enabled: true },
  { id: 'microwave', name: 'Microwave', watts: 1000, hours: 0.25, enabled: true },
  { id: 'iron', name: 'Iron', watts: 1200, hours: 0.5, enabled: true },
  { id: 'waterheater', name: 'Water heater', watts: 3000, hours: 0.5, enabled: true },
  { id: 'charger', name: 'Phone charger', watts: 6, hours: 3, enabled: true },
  { id: 'stereo', name: 'Sound system', watts: 80, hours: 2, enabled: true },
  { id: 'dishwasher', name: 'Dishwasher', watts: 1200, hours: 0.5, enabled: true },
  { id: 'oven', name: 'Electric oven', watts: 2000, hours: 0.5, enabled: true },
  { id: 'heater', name: 'Space heater', watts: 1500, hours: 1, enabled: true },
  { id: 'ac', name: 'Air conditioner (split)', watts: 1200, hours: 6, enabled: true },
  { id: 'pump', name: 'Water pump', watts: 400, hours: 1, enabled: true },
  { id: 'router', name: 'Internet router', watts: 10, hours: 24, enabled: true },
  { id: 'printer', name: 'Printer', watts: 50, hours: 0.2, enabled: true },
  { id: 'led_strip', name: 'LED strip lights', watts: 24, hours: 5, enabled: true }
];

// DOM references
const devicesList = document.getElementById('devices-list');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const costPerWhEl = document.getElementById('costPerWh');
const daysPerMonthEl = document.getElementById('daysPerMonth');
const summaryCards = document.getElementById('summaryCards');

let devicesState = JSON.parse(JSON.stringify(presets)); // deep copy

function formatNumber(n){
  return (Math.round(n * 100) / 100).toLocaleString();
}

function renderDevices(){
  devicesList.innerHTML = '';

  devicesState.forEach((d, idx) => {
    const div = document.createElement('div');
    div.className = 'device-item';

    div.innerHTML = `
      <input type="checkbox" data-idx="${idx}" class="toggle" ${d.enabled !== false ? 'checked' : ''}>
      <div class="name">
        <strong>${d.name}</strong>
        <div class="muted">Watts and hours/day</div>
      </div>

      <label>W
        <input data-idx="${idx}" class="watt" type="number" step="1" min="0" value="${d.watts}">
      </label>

      <label>h/day
        <input data-idx="${idx}" class="hours" type="number" step="0.1" min="0" value="${d.hours}">
      </label>
    `;

    devicesList.appendChild(div);
  });

  // ----- Event Listeners -----

  // Toggle enable/disable
  devicesList.querySelectorAll('input.toggle').forEach(el => {
    el.addEventListener('change', e => {
      const i = +e.target.dataset.idx;
      devicesState[i].enabled = e.target.checked;
    });
  });

  // Watt changes
  devicesList.querySelectorAll('input.watt').forEach(el => {
    el.addEventListener('input', e => {
      const i = +e.target.dataset.idx;
      devicesState[i].watts = Number(e.target.value) || 0;
    });
  });

  // Hours changes
  devicesList.querySelectorAll('input.hours').forEach(el => {
    el.addEventListener('input', e => {
      const i = +e.target.dataset.idx;
      devicesState[i].hours = Number(e.target.value) || 0;
    });
  });
}

function calculateAll(){
  const costPerWh = Number(costPerWhEl.value) || 0;
  const daysPerMonth = Number(daysPerMonthEl.value) || 30;

  summaryCards.innerHTML = '';

  let totalWhMonth = 0;
  let totalCostMonth = 0;

  devicesState.forEach(d => {
    if (d.enabled === false) return; // skip disabled devices

    const dailyWh = d.watts * d.hours;
    const monthlyWh = dailyWh * daysPerMonth;
    const monthlyCost = monthlyWh * costPerWh;

    totalWhMonth += monthlyWh;
    totalCostMonth += monthlyCost;

    // Summary card
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${d.name}</strong>
      <p class="muted">${d.watts} W × ${d.hours} h/day</p>
      <p>Monthly: ${formatNumber(monthlyWh)} Wh — ${formatNumber(monthlyCost)} COP</p>
    `;

    summaryCards.appendChild(card);
  });

  const totalWhYear = totalWhMonth * 12;
  const totalCostYear = totalCostMonth * 12;

  document.getElementById('totalWhMonth').textContent = `Monthly energy: ${formatNumber(totalWhMonth)} Wh`;
  document.getElementById('totalCostMonth').textContent = `Monthly cost: ${formatNumber(totalCostMonth)} COP`;
  document.getElementById('totalWhYear').textContent = `Yearly energy: ${formatNumber(totalWhYear)} Wh`;
  document.getElementById('totalCostYear').textContent = `Yearly cost: ${formatNumber(totalCostYear)} COP`;
}

function resetAll(){
  devicesState = JSON.parse(JSON.stringify(presets));
  renderDevices();
  costPerWhEl.value = '';
  daysPerMonthEl.value = 30;
  summaryCards.innerHTML = '';
  document.getElementById('totalWhMonth').textContent = 'Monthly energy: — Wh';
  document.getElementById('totalCostMonth').textContent = 'Monthly cost: — COP';
  document.getElementById('totalWhYear').textContent = 'Yearly energy: — Wh';
  document.getElementById('totalCostYear').textContent = 'Yearly cost: — COP';
}

// Init
renderDevices();

calculateBtn.addEventListener('click', calculateAll);
resetBtn.addEventListener('click', resetAll);
