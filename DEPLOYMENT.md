# IELTS "Productive Struggle" - Serverga Joylash (Deployment) Qo'llanmasi

Ushbu loyihani to'liq bepul (yoki eng arzon) va HTTPS protokoli bilan ishlaydigan platformalarga (Vercel va Render) yuklash bo'yicha qadam-baqadam ko'rsatma.

---

## 1-Qadam: Kodni GitHub ga yuklash
Barcha kodlarni o'zingizning GitHub hisobingizga bitta repository qilib yuklang.
1. GitHub-da `ielts-productive-struggle` nomli yangi repository yarating.
2. Terminalda quyidagilarni yozing:
   ```bash
   git init
   git add .
   git commit -m "First commit"
   git branch -M main
   git remote add origin https://github.com/SizningUsername/ielts-productive-struggle.git
   git push -u origin main
   ```

---

## 2-Qadam: Ma'lumotlar Bazasi (PostgreSQL) - Render.com
1. [Render.com](https://render.com) ga kiring va ro'yxatdan o'ting.
2. **Dashboard** dan **New** -> **PostgreSQL** ni tanlang.
3. Bazaga nom bering (masalan: `ielts-db`) va bepul (Free) tarifni tanlab, **Create** ni bosing.
4. Baza yaratilgach, **"Internal Database URL"** (Backend uchun) va **"External Database URL"** ni nusxalab oling.

---

## 3-Qadam: Backend va Bot (Django + Aiogram) - Render.com
Render'ning bepul planida alohida Background Worker ochib bo'lmagani uchun, biz Bot va Backend'ni bitta xizmat (Web Service) ichida birlashtirib ishga tushiramiz!

1. Render-da **New** -> **Web Service** ni tanlang.
2. GitHub'dagi repository-ni ulang.
3. Sozlamalar (Juda muhim):
   - **Name:** ielts-backend
   - **Root Directory:** *(bosh qoldiring - hech narsa yozmang!)*
   - **Environment:** `Python 3`
   - **Build Command:** `bash build.sh`
   - **Start Command:** `bash start.sh`
   - **Plan:** Free
4. **Environment Variables** (Muhit o'zgaruvchilari) bo'limini oching va quydagilarni qo'shing:
   - `DATABASE_URL` = (Boyagi bazaning Internal URL'i)
   - `DEBUG` = `False`
   - `TELEGRAM_BOT_TOKEN` = (BotFather'dan olingan token)
   - `WEBAPP_URL` = `https://ielts-frontend.vercel.app` (Buni 4-qadamdan keyin to'g'rilaysiz)
5. **Create Web Service** ni bosing.
6. Ishga tushgandan so'ng Render sizga link beradi: `https://ielts-backend-xxxx.onrender.com`. Shuni nusxalab oling.

---

## 4-Qadam: Frontend (React) - Vercel.com
1. [Vercel.com](https://vercel.com) ga kiring va GitHub orqali ro'yxatdan o'ting.
2. **Add New** -> **Project** ni bosing va GitHub repository-ni tanlang.
3. **Framework Preset** qismida avtomat `Vite` tanlanadi.
4. **Root Directory** ni `frontend` ga o'zgartiring (Edit bosib).
5. **Environment Variables** bo'limida bittasini qo'shing:
   - Name: `VITE_API_URL`
   - Value: `https://ielts-backend-xxxx.onrender.com/api` (Render bergan domen /api bilan)
6. **Deploy** ni bosing. 
7. Vercel sizga tayyor link beradi: `https://ielts-frontend.vercel.app`. Buni oling va Render'dagi `WEBAPP_URL` ga yozib qo'yishni unutmang!

---

## 6-Qadam: Telegram Web App tugmasini ulash
1. Telegramda `@BotFather` ga kiring.
2. `/mybots` deb yozing va botingizni tanlang.
3. **Bot Settings** -> **Menu Button** -> **Configure menu button** ni tanlang.
4. Vercel bergan linkni (`https://ielts-frontend.vercel.app`) yozing va tugmaga "Testni Boshlash" deb nom bering.

**TAYYOR! Barcha tizim muvaffaqiyatli ishga tushdi va u real foydalanuvchilar qabul qilishga tayyor! 🎉**
