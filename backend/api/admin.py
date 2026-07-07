from django.contrib import admin
from .models import User, Test, Question, Attempt

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'telegram_id', 'created_at')
    search_fields = ('username', 'telegram_id')

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'difficulty', 'created_at')
    search_fields = ('title', 'category')
    list_filter = ('category', 'difficulty')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'test', 'order', 'question_type')
    search_fields = ('question_text', 'test__title')
    list_filter = ('question_type', 'test')

@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'test', 'wrong_count', 'started_at')
    search_fields = ('user__username', 'test__title')
    list_filter = ('test', 'started_at')
