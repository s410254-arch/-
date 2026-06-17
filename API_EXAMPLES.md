# BabyCare API 測試範例

## 登入

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"parent@example.com","password":"pass123"}'
```

回應：
```json
{"ok":true,"token":"demo-token","user":{"email":"parent@example.com"}}
```

## 搜尋裝置

```bash
curl http://localhost:3000/api/devices
```

回應：
```json
{"ok":true,"devices":[{"id":"esp32-1","name":"BabyCare_ESP32","found":true,"rssi":-45}]}
```

## 配對裝置

```bash
curl -X POST http://localhost:3000/api/pair \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"esp32-1"}'
```

回應：
```json
{"ok":true,"device":{"id":"esp32-1","name":"BabyCare_ESP32","pairedAt":"2026-06-17T18:00:00.000Z"}}
```

## 傳送即時感測資料（模擬 ESP32）

```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 24.5,
    "humidity": 52,
    "turning": "正常",
    "light": "柔光模式",
    "alert": "正常"
  }'
```

### 帶警報的範例

```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 31,
    "humidity": 48,
    "turning": "異常",
    "light": "柔光模式",
    "alert": "溫度過高目前 31°C"
  }'
```

## 取得警報清單

```bash
curl http://localhost:3000/api/alerts
```

回應：
```json
{"ok":true,"alerts":[{"temperature":31,"humidity":48,"alert":"溫度過高...","timestamp":"2026-06-17T18:05:00.000Z","id":"a1234567890"}]}
```

## 取得當日讀數

```bash
curl "http://localhost:3000/api/readings?date=2026-06-17"
```

回應：
```json
{"ok":true,"readings":[{"temperature":24.5,"humidity":52,"alert":"正常","timestamp":"2026-06-17T10:00:00.000Z"},...]}
```

## 取得日平均

```bash
curl "http://localhost:3000/api/aggregate/daily?date=2026-06-17"
```

回應：
```json
{"ok":true,"date":"2026-06-17","averageTemperature":24.3,"averageHumidity":53,"count":12}
```

## 取得翻譯檔（某語系）

```bash
curl http://localhost:3000/api/locales/zh-TW
```

回應：
```json
{"ok":true,"locale":"zh-TW","data":{"nav.home":"首頁",...}}
```

## 更新翻譯檔

```bash
curl -X POST http://localhost:3000/api/locales/en \
  -H "Content-Type: application/json" \
  -d '{
    "nav.home": "Home",
    "nav.data": "Data Analysis",
    ...
  }'
```

---

## 快速測試流程

1. **啟動後端**
```bash
npm start
```

2. **測試登入**
```bash
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

3. **傳送感測資料**
```bash
curl -X POST http://localhost:3000/api/data -H "Content-Type: application/json" -d '{"temperature":24,"humidity":55,"turning":"正常","light":"柔光","alert":"正常"}'
```

4. **檢查資料庫**
```bash
cat db.json | jq '.readings[] | {temperature, humidity, alert}'
```
