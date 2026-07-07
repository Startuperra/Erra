import json
import hashlib
import hmac
from urllib.parse import parse_qsl
from django.conf import settings
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Test, Question, Attempt
from .serializers import TestSerializer, TestDetailSerializer

def validate_telegram_data(init_data: str, bot_token: str):
    parsed_data = dict(parse_qsl(init_data))
    if 'hash' not in parsed_data:
        return False, None
    hash_value = parsed_data.pop('hash')
    
    data_check_string = '\n'.join(
        f"{k}={v}" for k, v in sorted(parsed_data.items())
    )
    
    secret_key = hmac.new(b'WebAppData', bot_token.encode(), hashlib.sha256).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    if calculated_hash == hash_value:
        return True, parsed_data
    return False, None

class TelegramAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        init_data = request.data.get('initData')
        # Buni .env dan olish kerak
        bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', '')
        
        if not bot_token:
            return Response({"error": "Server configuration error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        is_valid, parsed_data = validate_telegram_data(init_data, bot_token)
        
        if not is_valid:
            return Response({"error": "Invalid Telegram data"}, status=status.HTTP_403_FORBIDDEN)
            
        user_json = parsed_data.get('user', '{}')
        try:
            tg_user = json.loads(user_json)
        except json.JSONDecodeError:
            return Response({"error": "Invalid user data"}, status=status.HTTP_400_BAD_REQUEST)

        tg_id = tg_user.get('id')
        username = tg_user.get('username', f"user_{tg_id}")
        first_name = tg_user.get('first_name', '')
        
        # User ni bazadan topish yoki yaratish
        user, created = User.objects.get_or_create(
            telegram_id=tg_id,
            defaults={'username': username, 'first_name': first_name}
        )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

def normalize_answer(ans):
    if not ans: return ""
    return str(ans).strip().lower()

class TestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Test.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TestDetailSerializer
        return TestSerializer

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        test = self.get_object()
        user_answers = request.data.get('answers', {})
        
        questions = test.questions.all()
        wrong_count = 0
        wrong_questions = []

        for q in questions:
            user_ans = normalize_answer(user_answers.get(str(q.id), ""))
            correct_ans = normalize_answer(q.correct_answer)
            if user_ans != correct_ans:
                wrong_count += 1
                wrong_questions.append(q.id)

        attempt = Attempt.objects.create(
            user=request.user,
            test=test,
            wrong_count=wrong_count,
            answers=user_answers,
            finished_at=timezone.now()
        )

        user = request.user
        today = timezone.now().date()
        
        # XP and Streak logic
        if wrong_count == 0:
            user.xp += 50
            user.completed_tests_count += 1
        
        if user.last_active_date != today:
            if user.last_active_date == today - timezone.timedelta(days=1):
                user.streak_days += 1
            else:
                user.streak_days = 1
            user.last_active_date = today
        user.save()

        return Response({
            "attempt_id": attempt.id,
            "total_questions": questions.count(),
            "wrong_count": wrong_count,
            "xp_earned": 50 if wrong_count == 0 else 0
        })

    @action(detail=True, methods=['post'], url_path='use-hint')
    def use_hint(self, request, pk=None):
        test = self.get_object()
        user_answers = request.data.get('answers', {})
        
        questions = test.questions.all()
        wrong_questions = []

        for q in questions:
            user_ans = normalize_answer(user_answers.get(str(q.id), ""))
            correct_ans = normalize_answer(q.correct_answer)
            if user_ans != correct_ans:
                wrong_questions.append(q)

        if not wrong_questions:
            return Response({"error": "No mistakes found!"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark hint as used in a new attempt record
        Attempt.objects.create(
            user=request.user,
            test=test,
            wrong_count=len(wrong_questions),
            answers=user_answers,
            hint_used=True,
            finished_at=timezone.now()
        )

        # Return the first wrong question's order number
        first_wrong = wrong_questions[0]
        return Response({
            "hint": f"Sizning xatolaringizdan biri {first_wrong.order}-savolda joylashgan."
        })

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "xp": user.xp,
            "streak_days": user.streak_days,
            "completed_tests_count": user.completed_tests_count
        })
