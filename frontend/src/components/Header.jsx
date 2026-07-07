import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Header = () => {
  const [stats, setStats] = useState({ xp: 0, streak_days: 0, completed_tests_count: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 w-full z-10 text-black">
      <div 
        className="font-bold text-lg cursor-pointer text-blue-600" 
        onClick={() => navigate('/')}
      >
        IELTS Train
      </div>
      <div className="flex gap-4 items-center">
        <div className="font-semibold text-orange-500">
          🔥 {stats.streak_days}
        </div>
        <div className="font-semibold text-yellow-500">
          ⭐️ {stats.xp} XP
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm font-semibold"
        >
          Mening Natijalarim
        </button>
      </div>
    </div>
  );
};

export default Header;
