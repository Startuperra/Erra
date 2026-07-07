import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import WebApp from '@twa-dev/sdk';

const TestSolve = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const [hint, setHint] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    api.get(`/tests/${id}/`)
      .then(res => setTest(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (qId, val) => {
    setAnswers({ ...answers, [qId]: val });
  };

  const handleHint = async () => {
    try {
      const res = await api.post(`/tests/${id}/use-hint/`, { answers });
      setHint(res.data.hint);
      setHintUsed(true);
    } catch (err) {
      if (err.response && err.response.data.error) {
        WebApp.showAlert(err.response.data.error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      WebApp.showConfirm("Testni yakunlaysizmi?", async (ok) => {
        if (ok) {
          const res = await api.post(`/tests/${id}/submit/`, { answers });
          navigate('/result', { state: res.data });
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!test) return <div className="p-4">Yuklanmoqda...</div>;

  return (
    <div className="p-4 pb-32">
      <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500">{test.questions.length} ta savol</span>
        <button 
          onClick={handleHint}
          disabled={hintUsed}
          className={`px-3 py-1 rounded text-sm font-bold ${hintUsed ? 'bg-gray-300 text-gray-500' : 'bg-purple-100 text-purple-600'}`}
        >
          Yordam olish (1/1)
        </button>
      </div>

      {hint && (
        <div className="bg-purple-100 text-purple-800 p-3 rounded mb-4 text-sm font-semibold border border-purple-300">
          💡 {hint}
        </div>
      )}

      <div className="space-y-4">
        {test.questions.map(q => (
          <div key={q.id} className="p-3 border rounded bg-white text-black">
            <p className="font-medium mb-2">{q.order}. {q.question_text}</p>
            <input 
              type="text" 
              className="border p-2 w-full rounded" 
              placeholder="Javobingiz..."
              value={answers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button 
        onClick={handleSubmit}
        className="fixed bottom-4 left-4 right-4 bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg z-10"
      >
        Check (Tekshirish)
      </button>
    </div>
  );
};

export default TestSolve;
