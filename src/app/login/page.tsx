"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de login básico
    if (username === 'admin' && password === 'admin') {
      router.push('/admin');
    } else if (username === 'user' && password === 'user') {
      router.push('/usuario');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
