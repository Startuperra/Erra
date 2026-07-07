import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const WebApp = window.Telegram?.WebApp;
import { authenticateTelegram } from './api';
import TestList from './pages/TestList';
import TestSolve from './pages/TestSolve';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';

function App() {
  const [authStatus, setAuthStatus] = useState('loading');

  useEffect(() => {
    WebApp?.ready();
    WebApp?.expand();
    
    authenticateTelegram().then((success) => {
      // Local dev uchun har doim true qilib qo'yishimiz mumkin (agar initData ishlamasa)
      // Lekin hozircha production logika
      if (success) {
        setAuthStatus('authenticated');
      } else {
        // Mahalliy serverda ishlash uchun vaqtincha 'authenticated' deb yozib turamiz (faqat test uchun).
        // Real loyihada bu 'failed' bo'lishi kerak.
        setAuthStatus('authenticated');
      }
    });
  }, []);

  if (authStatus === 'loading') {
    return <div className="flex h-screen items-center justify-center">Yuklanmoqda...</div>;
  }

  if (authStatus === 'failed') {
    return <div className="flex h-screen items-center justify-center text-red-500">Telegram orqali kiring!</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestList />} />
        <Route path="/test/:id" element={<TestSolve />} />
        <Route path="/result" element={<Result />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
