# BabyCare 部署指南

## 本地開發環境

### 前置需求
- Node.js 14+
- npm

### 啟動步驟

```bash
# 1. 安裝相依
npm install

# 2. 啟動後端
npm start
```

後端會運行在 `http://localhost:3000`

### 存取
- **首頁**: http://localhost:3000
- **登入**: http://localhost:3000/login.html
- **配對**: http://localhost:3000/pair.html
- **翻譯管理**: http://localhost:3000/i18n-admin.html

---

## Docker 部署（推薦用於生產）

### Dockerfile

在專案根目錄建立 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]
```

### 構建與運行

```bash
# 構建 Docker 映像
docker build -t babycare:latest .

# 運行容器
docker run -d \
  --name babycare \
  -p 3000:3000 \
  -v $(pwd)/db.json:/app/db.json \
  -v $(pwd)/locales:/app/locales \
  babycare:latest

# 查看日誌
docker logs -f babycare
```

### Docker Compose

在 `docker-compose.yml`：

```yaml
version: '3'
services:
  babycare:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./db.json:/app/db.json
      - ./locales:/app/locales
    environment:
      NODE_ENV: production
    restart: unless-stopped
```

運行：
```bash
docker-compose up -d
```

---

## 雲端部署

### Heroku（簡單快速）

```bash
# 登入 Heroku
heroku login

# 建立應用
heroku create babycare-demo

# 部署
git push heroku main

# 檢視日誌
heroku logs --tail
```

### Railway / Render / Fly.io

這些平台都支援 Node.js，只需連接 GitHub repo 並啟用自動部署。

1. 推送程式碼到 GitHub
2. 在 Railway/Render/Fly 連接 repo
3. 設定環境變數（如需要）
4. 部署

---

## 環境變數

建立 `.env` 檔：

```env
NODE_ENV=production
PORT=3000
```

在 `server.js` 中讀取：

```javascript
const PORT = process.env.PORT || 3000;
```

---

## 資料庫備份

### 備份 `db.json`

```bash
# 本地
cp db.json db.json.backup

# Docker
docker cp babycare:/app/db.json ./db.json.backup
```

### 定期備份（Cron Job）

在伺服器上設定每天備份：

```bash
# crontab -e
0 2 * * * cp /path/to/db.json /path/to/backups/db-$(date +\%Y-\%m-\%d).json
```

---

## SSL/HTTPS 設定

### 使用 Nginx 反向代理

```nginx
server {
    listen 443 ssl http2;
    server_name babycare.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name babycare.example.com;
    return 301 https://$server_name$request_uri;
}
```

重啟 Nginx：
```bash
sudo systemctl restart nginx
```

### Let's Encrypt 免費憑證

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d babycare.example.com
```

---

## 效能最佳化

### 啟用 Gzip 壓縮

在 `server.js` 中加入：

```javascript
const compression = require('compression');
app.use(compression());
```

安裝：
```bash
npm install compression
```

### 靜態文件快取

```javascript
app.use(express.static(__dirname, {
  maxAge: '1d',  // 1 天
  etag: false
}));
```

### 資料庫最佳化

針對大量資料，可考慮遷移到 SQLite 或 MongoDB：

```bash
npm install sqlite3
# 或
npm install mongoose
```

---

## 監控與日誌

### PM2 (Process Manager)

```bash
npm install -g pm2

# 啟動
pm2 start server.js --name babycare

# 監控
pm2 logs babycare

# 自動重啟
pm2 startup
pm2 save
```

### 日誌紀錄

在 `server.js` 加入 Winston 或 Pino：

```bash
npm install winston
```

```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Server started on port 3000');
```

---

## 故障排除

### 連線超時
- 檢查防火牆設定
- 確保 PORT 正確暴露
- 檢查後端是否運行：`curl http://localhost:3000/api/devices`

### 翻譯檔無法載入
- 確保 `locales/` 資料夾存在
- 檢查 JSON 語法：`jq . locales/zh-TW.json`

### 資料無法儲存
- 確保 `db.json` 可寫
- 檢查磁碟空間：`df -h`
- 檢查權限：`chmod 644 db.json`

---

## 支援

有任何問題，請查看 [README.md](README.md) 或提交 Issue。
