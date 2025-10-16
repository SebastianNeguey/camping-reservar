"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithSupabase } from './supabaseLogin';
import { getSession, getUserProfile } from '../../lib/supabase/supabaseSession';
import { setCookie, getCookie, deleteCookie } from '../../lib/supabase/cookieSession';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error } = await loginWithSupabase(email, password);
    if (error || !data.session) {
      setError('Usuario o contraseña incorrectos');
      setLoading(false);
      return;
    }
    // Guardar el token de sesión en una cookie
    setCookie('supabase_token', data.session.access_token);
    // Obtener sesión y perfil usando helpers
    const { session } = await getSession();
    if (!session) {
      setError('No se pudo obtener la sesión');
      setLoading(false);
      return;
    }
    const profile = await getUserProfile();
    setLoading(false);
    if (!profile) {
      setError('No se pudo obtener el perfil');
      return;
    }
    if (profile.role === 'admin') {
      router.push('/admin');
    } else if (profile.role === 'user') {
      router.push('/usuario');
    } else {
      setError('Rol no reconocido');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
        <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700" disabled={loading}>
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
