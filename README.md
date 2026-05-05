# IPTV Backend API 🚀

Backend Node.js + Express + MongoDB cung cấp dữ liệu kênh TV trực tiếp (IPTV) cho ứng dụng Android.

## Yêu cầu hệ thống
- Node.js >= 18.x
- MongoDB (đang chạy local ở port 27017 hoặc Remote)

## 📦 Cài đặt dự án

1. Clone dự án và cài đặt thư viện:
```bash
npm install
```

2. Tạo file `.env` (nếu chưa có):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/iptv_db
M3U_FILE_PATH=./data/channels.m3u
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

3. Nạp dữ liệu kênh từ file M3U vào Database (chỉ chạy lần đầu):
```bash
npm run import
```

4. Chạy Server:
```bash
npm run dev
```

Server sẽ khởi động tại địa chỉ: `http://localhost:3000`

---

## 📖 Tài liệu API (Swagger UI)
Bạn có thể xem toàn bộ tài liệu API và **test trực tiếp** trên trình duyệt thông qua Swagger:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## 📱 Hướng dẫn kết nối cho Android App (Retrofit/OkHttp)

### Base URL:
`http://<IP_MÁY_TÍNH_CỦA_BẠN>:3000` 
*(Lưu ý: Dùng `10.0.2.2:3000` nếu chạy trên Emulator Android, hoặc lấy địa chỉ IPv4 LAN của máy tính `192.168.x.x` nếu test trên máy thật).*

### 1. Lấy danh sách toàn bộ kênh
- **Endpoint**: `GET /api/channels`
- **Response**:
```json
{
  "success": true,
  "total": 3,
  "data": [
    {
      "channelId": "vtv1",
      "name": "VTV1",
      "group": "XemTV",
      "logo": "https://vn.xemtv.net/image/vtv1.png",
      "streamUrl": "https://live.fptplay53.net/fnxch2/vtv1hd_abr.smil/chunklist.m3u8",
      "type": "hls"
    }
  ]
}
```

### 2. Lấy danh sách nhóm (Categories)
- **Endpoint**: `GET /api/channels/groups`
- **Response**:
```json
{
  "success": true,
  "total": 1,
  "data": ["XemTV"]
}
```

### 3. Lọc kênh theo nhóm / Tìm kiếm
- **Lọc theo nhóm**: `GET /api/channels?group=XemTV`
- **Tìm kiếm**: `GET /api/channels?q=vtv`

### 4. Kiểm tra trạng thái Stream (Online/Offline)
- Dùng để hiện icon `Live 🟢` hoặc báo lỗi nếu link chết.
- **Endpoint**: `GET /api/channels/{id}/check`
- **Ví dụ**: `GET /api/channels/vtv1/check`
- **Response**:
```json
{
  "success": true,
  "channelId": "vtv1",
  "isOnline": true,
  "latency": 250,
  "statusCode": 200,
  "checkedAt": "2026-05-04T12:00:00.000Z"
}
```

---

## 🛡 Bảo mật & Tối ưu hoá (Đã tích hợp)
- **Helmet**: Bảo vệ HTTP Headers tự động.
- **CORS**: Mở chặn tên miền để Android dễ dàng call qua mạng nội bộ.
- **Rate-limit**: Chặn SPAM request, mặc định 100 req / 15 phút.
- **Global Error Handler**: Bắt lỗi tập trung tránh sập server.
