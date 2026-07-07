#!/usr/bin/env bash

# Botni orqa fonda (background) ishga tushirish
cd bot
python main.py &
cd ..

# Djangoni asosiy process sifatida ishga tushirish
cd backend
gunicorn config.wsgi:application
