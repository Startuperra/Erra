import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
const WebApp = window.Telegram?.WebApp;

const TestSolve = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const [hint, setHint] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  
  // Practice mode state
  const [feedback, setFeedback] = useState(null); // { correct_count, wrong_count, wrong_ids, correct_ids }

  useEffect(() => {
    api.get(`/tests/${id}/`)
      .then(res => setTest(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (qId, val) => {
    setAnswers({ ...answers, [qId]: val });
    // Foydalanuvchi yangi javob kiritganda qizil/yashil ranglarni olib tashlash
    if (feedback) {
       setFeedback({
         ...feedback,
         wrong_ids: (feedback.wrong_ids || []).filter(id => id !== qId),
         correct_ids: (feedback.correct_ids || []).filter(id => id !== qId)
       });
    }
  };

  const handleHint = async () => {
    try {
      const res = await api.post(`/tests/${id}/use-hint/`, { answers });
      setHint(res.data.hint);
      setHintUsed(true);
    } catch (err) {
      if (err.response && err.response.data.error) {
        WebApp?.showAlert(err.response.data.error);
      }
    }
  };

  const handleCheck = async () => {
    try {
      const res = await api.post(`/tests/${id}/check-answers/`, { answers });
      setFeedback({
        correct_count: res.data.correct_count,
        wrong_count: res.data.wrong_count,
        wrong_ids: res.data.wrong_question_ids,
        correct_ids: res.data.correct_question_ids
      });
      if (res.data.wrong_count === 0) {
         WebApp?.showAlert("Tabriklaymiz! Hamma javoblar to'g'ri!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (WebApp?.showConfirm) {
        WebApp.showConfirm("Testni yakunlaysizmi?", async (ok) => {
          if (ok) {
            const res = await api.post(`/tests/${id}/submit/`, { answers });
            navigate('/result', { state: res.data });
          }
        });
      } else {
        if (window.confirm("Testni yakunlaysizmi?")) {
            const res = await api.post(`/tests/${id}/submit/`, { answers });
            navigate('/result', { state: res.data });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!test) return <div className="p-4">Yuklanmoqda...</div>;

  const renderInput = (q) => {
    const isWrong = feedback?.wrong_ids?.includes(q.id);
    const isCorrect = feedback?.correct_ids?.includes(q.id);
    const borderClass = isWrong ? 'border-red-500 bg-red-50' : (isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-300');

    if (q.question_type === 'multiple_choice' || q.question_type === 'true_false_not_given') {
       const opts = Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'];
       return (
         <div className={`mt-2 p-2 rounded border ${borderClass}`}>
           {opts.map((opt, idx) => (
             <label key={idx} className="block mb-2 cursor-pointer">
               <input 
                 type="radio" 
                 name={`q_${q.id}`} 
                 value={opt}
                 checked={answers[q.id] === opt}
                 onChange={(e) => handleChange(q.id, e.target.value)}
                 className="mr-2"
               />
               {opt}
             </label>
           ))}
         </div>
       );
    }

    // Default fill in the blank
    return (
      <input 
        type="text" 
        className={`border p-2 w-full rounded mt-2 ${borderClass}`} 
        placeholder="Javobingiz..."
        value={answers[q.id] || ''}
        onChange={(e) => handleChange(q.id, e.target.value)}
      />
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      
      {/* Chap / Yuqori qism: Passage (Reading) yoki Audio (Listening) */}
      {(test.passage || test.audio_url) && (
        <div className="w-full md:w-1/2 p-4 bg-white overflow-y-auto border-r border-gray-200">
          <h2 className="text-xl font-bold mb-4">{test.title}</h2>
          
          {test.audio_url && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold mb-2">Audio eshitish:</p>
              <audio controls src={test.audio_url} className="w-full" />
            </div>
          )}

          {test.passage && (
            <div className="prose max-w-none text-gray-800 leading-relaxed" 
                 dangerouslySetInnerHTML={{ __html: test.passage }} />
          )}
        </div>
      )}

      {/* O'ng / Pastki qism: Savollar va Javoblar */}
      <div className={`w-full ${test.passage || test.audio_url ? 'md:w-1/2' : ''} p-4 pb-32 overflow-y-auto relative`}>
        
        {!(test.passage || test.audio_url) && (
           <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
        )}

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500 font-medium">{test.questions.length} ta savol</span>
          <button 
            onClick={handleHint}
            disabled={hintUsed}
            className={`px-3 py-1 rounded text-sm font-bold shadow-sm ${hintUsed ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
          >
            Yordam (1/1)
          </button>
        </div>

        {hint && (
          <div className="bg-purple-100 text-purple-800 p-3 rounded mb-4 text-sm font-semibold border border-purple-300 shadow-sm animate-pulse">
            💡 {hint}
          </div>
        )}

        {feedback && (
          <div className={`p-4 rounded mb-4 font-bold shadow-sm ${feedback.wrong_count === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
             Natija: {feedback.correct_count} ta to'g'ri, {feedback.wrong_count} ta xato. 
             {feedback.wrong_count > 0 && " Xatolarni to'g'rilab yana urinib ko'ring!"}
          </div>
        )}

        <div className="space-y-6">
          {test.questions.map(q => (
            <div key={q.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <p className="font-semibold text-gray-800 text-lg">{q.order}. {q.question_text}</p>
              {renderInput(q)}
            </div>
          ))}
        </div>

        {/* Buttons at the bottom */}
        <div className={`fixed bottom-0 left-0 ${test.passage || test.audio_url ? 'md:left-1/2' : ''} right-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex gap-2`}>
           <button 
            onClick={handleCheck}
            className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg active:scale-95 transition-transform"
          >
            Check
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg active:scale-95 transition-transform"
          >
            Finish
          </button>
        </div>

      </div>
    </div>
  );
};

export default TestSolve;
