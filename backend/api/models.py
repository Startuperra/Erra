from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    telegram_id = models.BigIntegerField(unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    xp = models.PositiveIntegerField(default=0)
    completed_tests_count = models.PositiveIntegerField(default=0)
    streak_days = models.PositiveIntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username or str(self.telegram_id)

class Test(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50) # Masalan: Reading, Listening
    difficulty = models.CharField(max_length=50, blank=True, null=True)
    passage = models.TextField(blank=True, null=True, help_text="Reading testlari uchun matn (HTML)")
    audio_url = models.URLField(blank=True, null=True, help_text="Listening testlari uchun audio fayl havolasi")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    test = models.ForeignKey(Test, related_name='questions', on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    question_text = models.TextField()
    question_type = models.CharField(max_length=50) # Masalan: fill_blank, multiple_choice, true_false_not_given
    options = models.JSONField(blank=True, null=True, help_text="Variantlar (faqat multiple_choice uchun)")
    correct_answer = models.JSONField(help_text="To'g'ri javoblar ro'yxati (masalan: [\"apple\", \"apples\"])")

    class Meta:
        ordering = ['order']
        unique_together = ('test', 'order')

    def __str__(self):
        return f"{self.test.title} - Q{self.order}"

class Attempt(models.Model):
    user = models.ForeignKey(User, related_name='attempts', on_delete=models.CASCADE)
    test = models.ForeignKey(Test, related_name='attempts', on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    wrong_count = models.PositiveIntegerField(default=0)
    answers = models.JSONField(default=dict) # Format: {question_id: user_answer}
    hint_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.test.title} (Xatolar: {self.wrong_count})"
