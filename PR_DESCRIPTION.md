PR: Centralize API_BASE in config.js

變更摘要

- 新增 `config.js` 作為前端的 fallback 設定，當沒有伺服器提供覆寫時，會使用當前網域作為 `API_BASE`。
- 在 `server.js` 新增動態路由 `/config.js`，會輸出 `window.__API_BASE__ = "...";`，其值來自 `process.env.API_BASE`。
- 更新前端 HTML 檔 (`index.html`, `pair.html`, `login.html`, `i18n-admin.html`) 改為載入 `config.js` 並使用 `API_BASE` 變數呼叫 API。
- 更新 `start-public.sh`，可從第一個參數或環境變數 `API_BASE` 導出，啟動時會讓 server 的 `/config.js` 自動回傳該值。

為何要這樣改？

- 方便在不同環境（本機、測試、部署）覆寫 API endpoint，而不用修改多處前端檔案。
- 讓部署時能透過環境變數或啟動腳本提供正確的後端位址，支援 CI/CD 與反向代理情境。

使用指引

1) 本機快速測試（以 172.20.10.2 為例）

```bash
# 從專案目錄啟動並覆寫 API_BASE
./start-public.sh http://172.20.10.2
# 或者先 export
export API_BASE=http://172.20.10.2
./start-public.sh
```

2) 在容器 / 宿主機生產環境

- 設定環境變數 `API_BASE`，使 Express 的 `/config.js` 回傳正確值：

```bash
export API_BASE=https://api.example.com
npm start
```

3) 前端覆寫（在 HTML 或伺服器模板）

- 若需要在 HTML 頁面上直接覆寫（例如 CDN 或特殊環境），可在載入 `config.js` 之前，於頁面插入：

```html
<script>window.__API_BASE__ = 'http://172.20.10.2';</script>
<script src="/config.js"></script>
<script src="/config.js"></script>
```

（注意：伺服器的 `/config.js` 會覆蓋 `window.__API_BASE__`，除非伺服器端未設 `API_BASE`。）

回退與相容性

- 若部署環境不提供 `/config.js`，前端內建的 `config.js` fallback 會以當前 origin 作為 `API_BASE`，保持舊有本機 `localhost` 開發流程可用。

安全性註記

- 請確保公開部署時 `API_BASE` 指向安全的 HTTPS API 端點，避免從不安全來源載入敏感設定。

---

如果你要我：
- 把 PR 標為 Draft，我會嘗試透過 GitHub API 更新（若可行）。
- 或直接合併到 `main`，請回覆「合併」。
- 如果要我在你的主機執行診斷，請授權或貼上 `ping` / `curl` 的輸出。