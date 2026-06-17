const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return { users: [], devices: [], readings: [], alerts: [] };
  }
}

function writeDB(obj) {
  fs.writeFileSync(DB_PATH, JSON.stringify(obj, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ ok: false, message: 'missing email' });
  // Demo: accept any email/password and return token
  return res.json({ ok: true, token: 'demo-token', user: { email } });
});

app.get('/api/devices', (req, res) => {
  // Simulate scanning devices
  const devices = [
    { id: 'esp32-1', name: 'BabyCare_ESP32', found: true, rssi: -45 }
  ];
  res.json({ ok: true, devices });
});

app.post('/api/pair', (req, res) => {
  const { deviceId } = req.body;
  if (!deviceId) return res.status(400).json({ ok: false });
  const db = readDB();
  const device = { id: deviceId, name: 'BabyCare_ESP32', pairedAt: new Date().toISOString() };
  db.devices = db.devices || [];
  db.devices.push(device);
  writeDB(db);
  res.json({ ok: true, device });
});

app.post('/api/data', (req, res) => {
  const payload = req.body;
  if (!payload) return res.status(400).json({ ok: false });
  const db = readDB();
  db.readings = db.readings || [];
  const item = Object.assign({}, payload, { timestamp: new Date().toISOString() });
  db.readings.push(item);
  // if alert present and not '正常', add to alerts
  db.alerts = db.alerts || [];
  if (payload.alert && payload.alert !== '正常') {
    db.alerts.push({ ...item, id: `a${Date.now()}` });
  }
  writeDB(db);
  res.json({ ok: true });
});

app.get('/api/alerts', (req, res) => {
  const db = readDB();
  res.json({ ok: true, alerts: db.alerts || [] });
});

// Serve and update locale files via API (simple admin)
app.get('/api/locales/:locale', (req, res) => {
  const loc = req.params.locale;
  const locPath = path.join(__dirname, 'locales', `${loc}.json`);
  try {
    if (!fs.existsSync(locPath)) return res.status(404).json({ ok: false, message: 'locale not found' });
    const content = fs.readFileSync(locPath, 'utf8');
    return res.json({ ok: true, locale: loc, data: JSON.parse(content) });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message });
  }
});

app.post('/api/locales/:locale', (req, res) => {
  const loc = req.params.locale;
  const data = req.body;
  const locPath = path.join(__dirname, 'locales', `${loc}.json`);
  try {
    // write pretty JSON
    fs.writeFileSync(locPath, JSON.stringify(data, null, 2));
    return res.json({ ok: true, locale: loc });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message });
  }
});

app.get('/api/readings', (req, res) => {
  const { date } = req.query;
  const db = readDB();
  let items = db.readings || [];
  if (date) {
    items = items.filter(r => r.timestamp && r.timestamp.startsWith(date));
  }
  res.json({ ok: true, readings: items });
});

app.get('/api/aggregate/daily', (req, res) => {
  const { date } = req.query; // YYYY-MM-DD
  const db = readDB();
  const items = (db.readings || []).filter(r => r.timestamp && (!date || r.timestamp.startsWith(date)));
  const tempVals = items.map(i => i.temperature).filter(v => typeof v === 'number');
  const humVals = items.map(i => i.humidity).filter(v => typeof v === 'number');
  const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
  res.json({ ok: true, date: date || null, averageTemperature: avg(tempVals), averageHumidity: avg(humVals), count: items.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BabyCare backend running on http://localhost:${PORT}`));
