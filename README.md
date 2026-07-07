# IELTS "Productive Struggle" MVP

Ushbu loyiha Telegram Mini App orqali IELTS testlarini "Productive Struggle" metodikasi asosida yechishga mo'ljallangan platformadir.

## Texnologiyalar
- **Backend:** Django, DRF, PostgreSQL, Docker
- **Bot:** Aiogram 3.x
- **Frontend:** React.js (Vite), TailwindCSS, @twa-dev/sdk

---

## 🛠️ Loyihani Local Kompyuterda Ishga Tushirish

### 1. Muhit O'zgaruvchilarini sozlash
Loyihaning asosiy papkasida (shu yerda) `.env` nomli fayl yarating va uning ichiga quyidagilarni yozing:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxyz
WEBAPP_URL=https://sizning-ngrok-yoki-vercel-domeningiz.com
```

### 2. Backend va Botni ishga tushirish (Docker yordamida)
Loyihada `docker-compose` sozlangan. Quyidagi komanda orqali PostgreSQL bazasi, Django backend va Telegram bot bir vaqtda ishga tushadi:

```bash
docker-compose up --build
```
> **Eslatma:** Django serveri `http://localhost:8000` da ishlaydi. Bot esa avtomatik ravishda polling orqali Telegram serverlariga ulanadi.

#### Superuser yaratish (Admin panelga kirish uchun)
Django konteyneri ichiga kirib superuser yarating:
```bash
docker-compose exec backend python manage.py createsuperuser
```
Keyin `http://localhost:8000/admin/` ga kirib, test va savollarni qo'shishingiz mumkin.

---

### 3. Frontend (React) ni ishga tushirish
Frontend React qismi alohida npm orqali ishga tushiriladi (Docker ichida emas, local dev server orqali).
Yangi terminal oching va `frontend` papkasiga kiring:
```bash
cd frontend
npm install
npm run dev
```
> **Eslatma:** React `http://localhost:5173` da ishlaydi.

### 4. Telegram Web App ni ulash
Telegram Web App mahalliy `localhost` bilan to'g'ridan-to'g'ri ishlamaydi. Uni test qilish uchun:
1. `ngrok` yoki `localtunnel` orqali frontend portingizni (5173) internetga chiqaring:
   ```bash
   ngrok http 5173
   ```
2. Ngrok bergan HTTPS domenni `.env` fayldagi `WEBAPP_URL` ga yozing.
3. Shuningdek, Backend API uchun ham Ngrok ishlatishingiz mumkin yoki React-da API URL ni localhost orqali chaqiraverasiz.
4. @BotFather da bot sozlamalariga kirib `Menu Button` URL yoki `/start` javobidagi URL'ni o'rnating.

### Arxitektura va Xavfsizlik 🔐
- Barcha so'rovlar Telegramdan olingan `initData` ni HMAC-SHA256 yordamida bot token orqali tekshirish yo'li bilan ruxsatlanadi (Frontend -> `api/auth/telegram/`).
- API hech qachon savolning to'g'ri javobini (`correct_answer`) frontendga uzatmaydi. Talaba faqat xatolar sonini va qaysi savolda xato qilganligini ko'radi.
