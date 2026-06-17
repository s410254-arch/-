# BabyCare demo backend

簡易 Node.js/Express 後端，用於示範 ESP32 傳送即時資料、儲存歷史資料與警報。

啟動：

```bash
npm install
npm start
```

API 範例：
- `POST /api/login` { email, password }
- `GET /api/devices` 模擬搜尋裝置
- `POST /api/pair` { deviceId }
- `POST /api/data` 接收 ESP32 傳來的 JSON 資料
- `GET /api/alerts` 取得警報清單
- `GET /api/readings?date=YYYY-MM-DD` 取得當日讀數
- `GET /api/aggregate/daily?date=YYYY-MM-DD` 計算日平均

資料會儲存在 `db.json`（純示範用途，不適用於生產環境）。
# BabyCare 智慧嬰兒照護系統

示範型網站，展示智慧嬰兒照護儀表板的內容與樣式。

## 使用方式

1. 直接開啟 `index.html`。
2. 或使用本地伺服器：

```bash
python3 -m http.server 8000
```

然後前往：

```text
http://localhost:8000
```

## 檔案說明

- `index.html`：網站主頁結構與內容。
- `styles.css`：樣式與佈局。
