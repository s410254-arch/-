# ESP32 BLE 範例（Arduino）

以下為簡單的 ESP32 BLE 範例，示範如何透過 BLE 廣播裝置名稱 `BabyCare_ESP32` 並在連線後提供一個可讀取/notify 的特徵值來傳送 JSON 資料。

將此程式上傳到 ESP32（需安裝 `NimBLE-Arduino` 或 `ESP32 BLE` 支援）。

```cpp
#include <NimBLEDevice.h>

NimBLEServer* pServer = nullptr;
NimBLECharacteristic* pChar = nullptr;

void setup() {
  Serial.begin(115200);
  NimBLEDevice::init("BabyCare_ESP32");
  pServer = NimBLEDevice::createServer();
  NimBLEService* pService = pServer->createService("12345678-1234-5678-1234-56789abcdef0");
  pChar = pService->createCharacteristic(
    "abcdefab-1234-5678-1234-56789abcdef1",
    NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::NOTIFY
  );
  pService->start();
  NimBLEAdvertising* pAdv = NimBLEDevice::getAdvertising();
  pAdv->addServiceUUID(pService->getUUID());
  pAdv->start();
  Serial.println("BLE started: BabyCare_ESP32");
}

void loop() {
  // 範例：每 10 秒更新一次 JSON 字串並 notify 給已連線的客戶端
  static unsigned long last = 0;
  if (millis() - last > 10000) {
    last = millis();
    float temp = 23.1; // 讀自感測器
    int hum = 53;
    const char* jsonFmt = "{\"temperature\":%.1f,\"humidity\":%d,\"turning\":\"正常\",\"light\":\"柔光模式\",\"alert\":\"正常\"}";
    char buf[256];
    snprintf(buf, sizeof(buf), jsonFmt, temp, hum);
    Serial.println(buf);
    if (pChar) pChar->setValue((uint8_t*)buf, strlen(buf));
    if (pChar && pChar->getSubscribersCount() > 0) pChar->notify();
  }
  delay(100);
}
```

說明：
- 使用者可用手機或瀏覽器透過 Web Bluetooth 配對並連線至特徵值，讀取或訂閱通知來獲取 JSON 資料。
