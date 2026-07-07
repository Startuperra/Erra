import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div className="pt-20 p-4">Yuklanmoqda...</div>;

  return (
    <div className="pt-20 p-4 bg-gray-50 min-h-screen text-black">
      <Header />
      <h1 className="text-2xl font-bold mb-6 text-center">Sizning Statistikangiz</h1>
      
      <div className="grid gap-4 max-w-sm mx-auto">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-center justify-between">
          <div className="text-gray-500 font-medium">Umumiy XP</div>
          <div className="text-2xl font-bold text-yellow-500">⭐️ {stats.xp}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-center justify-between">
          <div className="text-gray-500 font-medium">Ketma-ket kunlar (Streak)</div>
          <div className="text-2xl font-bold text-orange-500">🔥 {stats.streak_days}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-center justify-between">
          <div className="text-gray-500 font-medium">Tugatilgan testlar (100%)</div>
          <div className="text-2xl font-bold text-green-500">✅ {stats.completed_tests_count}</div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-md"
        >
          Testlarga qaytish
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
