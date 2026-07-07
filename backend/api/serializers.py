from rest_framework import serializers
from .models import Test, Question, Attempt

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'title', 'description', 'category', 'difficulty', 'created_at']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        # correct_answer BU YERDA QASDDAN TUSHIRIB QOLDIRILGAN!
        fields = ['id', 'order', 'question_text', 'question_type']

class TestDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ['id', 'title', 'description', 'category', 'difficulty', 'created_at', 'questions']

class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = ['id', 'test', 'started_at', 'finished_at', 'wrong_count']
