# BabyCare 全平台部署指南

## 🚀 快速部署（5分鐘）

### 方案 A: Railway.app（推薦 ⭐）
最簡單，無需信用卡即可試用

1. 訪問 https://railway.app
2. 用 GitHub 登入（或郵箱）
3. 創建新 Project > Deploy from GitHub Repo
4. 選擇此倉庫
5. 等待 2-3 分鐘，自動部署
6. 複製生成的 URL（如 `https://babycare-production.up.railway.app`）

✅ 完成！大家都能訪問

---

### 方案 B: Render.com
免費 tier，自動部署

1. 訪問 https://render.com
2. 用 GitHub 登入
3. 點「New +」> 「Web Service」
4. 連接倉庫
5. 設置：
   - Build Command: `npm install`
   - Start Command: `npm start`
6. 等待部署（3-5 分鐘）
7. 複製生成的 URL

✅ 完成！

---

### 方案 C: Vercel
適合全靜態 + API

1. 訪問 https://vercel.com
2. 用 GitHub 登入
3. 點「Add New」> 「Project」
4. 導入此倉庫
5. 自動偵測 `vercel.json` 配置
6. 點「Deploy」
7. 複製生成的 URL

✅ 完成！

---

### 方案 D: Heroku（舊平台，但仍可用）
1. 訪問 https://heroku.com
2. 創建 App
3. 連接 GitHub 倉庫
4. 啟用「Automatic Deploys」
5. 手動 Deploy Branch

✅ 完成！

---

## 📝 本機測試

```bash
cd /workspaces/-
npm install
npm start
# 訪問 http://localhost:3000
```

---

## 🌐 公開 URL 示例

部署後，大家都能訪問：
- **首頁**: `https://your-app.railway.app`
- **登入**: `https://your-app.railway.app/login.html`
- **配對**: `https://your-app.railway.app/pair.html`
- **API**: `https://your-app.railway.app/api/devices`

---

## ✅ 驗證部署成功

```bash
# 測試 API（用部署後的 URL 替換 <YOUR_URL>）
curl https://<YOUR_URL>/api/devices
# 應返回: {"ok":true,"devices":[{"id":"esp32-1","name":"BabyCare_ESP32","found":true,"rssi":-45}]}

# 測試主頁
curl https://<YOUR_URL>
# 應返回 HTML 內容
```

---

## 🔧 環境變數

如需自訂，在平台上添加：
- `NODE_ENV=production`
- `PORT` （自動設定，無需修改）

---

## 📊 平台比較

| 平台 | 免費額度 | 啟動時間 | 推薦度 |
|------|--------|--------|------|
| Railway | $5/月免費額度 | 2-3 分鐘 | ⭐⭐⭐⭐⭐ |
| Render | 無限免費 | 3-5 分鐘 | ⭐⭐⭐⭐ |
| Vercel | 無限免費 | 1-2 分鐘 | ⭐⭐⭐⭐ |
| Heroku | 已停止免費 | N/A | ❌ |

---

## 🎯 我選哪一個？

- **第一次試用？** → 用 **Railway**（最簡單）
- **長期運行？** → 用 **Render**（免費無限制）
- **只要快速上線？** → 用 **Vercel**（最快）

---

## ❓ 常見問題

### Q: 如何更新已部署的應用？
A: 只需推送更新到 GitHub，平台會自動重新部署（取決於平台設定）

### Q: 如何查看日誌？
A: 在平台的 Dashboard 上檢視 Logs 選項卡

### Q: 如何添加自己的域名？
A: 在平台設定中添加自訂域名（付費功能）

### Q: 免費額度用完了怎麼辦？
A: 升級到付費方案，或換另一個平台

---

## 📞 部署遇到問題？

查看平台的 Logs 頁面：
- **Build failed** → 檢查 `npm install` 是否成功
- **App crashed** → 檢查 server.js 是否有錯誤
- **502 Bad Gateway** → 等待幾秒鐘重試

---

**現在就試試看吧！** 🚀
