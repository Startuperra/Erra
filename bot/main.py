import asyncio
import logging
import os
from dotenv import load_dotenv

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL")

dp = Dispatcher()

@dp.message(CommandStart())
async def command_start_handler(message: types.Message):
    """
    This handler receives messages with `/start` command
    """
    if not WEBAPP_URL:
        await message.answer("Tizimda WEBAPP_URL sozlanmagan. Admin bilan bog'laning.")
        return

    # Web App ni ochish uchun tugma
    markup = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📝 Testni boshlash",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ]
    )
    
    welcome_text = (
        f"Assalomu alaykum, {message.from_user.full_name}! 👋\n\n"
        "IELTS 'Productive Struggle' platformasiga xush kelibsiz.\n"
        "Siz bu yerda xatolaringizni o'zingiz topish orqali ballingizni tezroq o'stirasiz!\n\n"
        "Testni boshlash uchun quyidagi tugmani bosing:"
    )
    
    await message.answer(welcome_text, reply_markup=markup)

from apscheduler.schedulers.asyncio import AsyncIOScheduler

async def send_daily_reminder(bot: Bot):
    # Bu yerda bazadan 'streak yonib ketish arafasida bo'lgan' 
    # foydalanuvchilar olinishi kerak (API orqali).
    # Hozircha logikani o'zi (skeleton) yozib qoldirildi.
    logging.info("Sending daily reminders to users...")

async def main():
    if not BOT_TOKEN:
        logging.error("BOT_TOKEN is not set in .env file!")
        return
        
    bot = Bot(token=BOT_TOKEN)
    
    # Schedulerni sozlash
    scheduler = AsyncIOScheduler(timezone="Asia/Tashkent")
    scheduler.add_job(send_daily_reminder, trigger='cron', hour=18, minute=0, kwargs={'bot': bot})
    scheduler.start()

    logging.info("Bot started!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
