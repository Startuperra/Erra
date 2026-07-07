import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) return <div className="p-4">Natija topilmadi</div>;

  const { total_questions, wrong_count, xp_earned } = result;
  const isPerfect = wrong_count === 0;

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen text-center">
      {isPerfect && <Confetti recycle={false} numberOfPieces={500} />}
      {isPerfect ? (
        <div className="bg-green-100 p-6 rounded-xl border border-green-300">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Tabriklaymiz! 🎉</h1>
          <p className="text-green-800">Siz barcha savollarga to'g'ri javob berdingiz!</p>
          <p className="font-bold text-yellow-600 text-xl mt-4">+ {xp_earned} XP yutib oldingiz!</p>
        </div>
      ) : (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Sizda xatolar bor!</h1>
          <p className="text-lg mb-2">
            Jami: <span className="font-bold">{total_questions}</span> ta savol
          </p>
          <p className="text-lg text-red-600 font-bold mb-4">
            Xatolar: {wrong_count} ta
          </p>
          <p className="text-sm text-gray-500 mb-6 italic">
            Qaysi javob to'g'ri ekanligi ko'rsatilmaydi. Qayta o'qib topishga harakat qiling! (Productive Struggle)
          </p>
          <button 
            onClick={() => navigate(-1)} 
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold"
          >
            Qaytadan urinib ko'rish
          </button>
        </div>
      )}
      
      <button 
        onClick={() => navigate('/')} 
        className="mt-6 text-blue-500 underline"
      >
        Bosh sahifaga qaytish
      </button>
    </div>
  );
};

export default Result;
