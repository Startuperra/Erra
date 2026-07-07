import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/tests/')
      .then(res => setTests(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="pt-20 p-4">
      <Header />
      <h1 className="text-2xl font-bold mb-4">IELTS Testlari</h1>
      <div className="grid gap-4">
        {tests.map(test => (
          <div key={test.id} className="p-4 border rounded shadow-sm bg-white text-black">
            <h2 className="text-xl font-semibold">{test.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{test.category} | Qiyinlik: {test.difficulty}</p>
            <p className="mb-4">{test.description}</p>
            <button 
              onClick={() => navigate(`/test/${test.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Testni boshlash
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestList;
