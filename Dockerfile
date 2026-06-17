# 使用 Node.js 官方映像
FROM node:18-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package files
COPY package.json package-lock.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製應用代碼
COPY . .

# 暴露端口（Google Cloud Run 使用）
EXPOSE 8080

# 啟動應用
CMD ["node", "server.js"]
