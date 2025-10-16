"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, logoutSupabase } from '../../../lib/supabase/supabaseSession';

const UserNavbar: React.FC = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      const profile = await getUserProfile();
      setUsername(profile?.username || '');
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logoutSupabase();
    router.push('/login');
  };

  return (
    <nav className="w-full h-16 bg-white shadow flex items-center px-6 justify-between z-30">
      <span className="font-bold text-xl text-gray-800">{username ? `Bienvenido, ${username}` : 'Camping Reservar Usuario'}</span>
      <div className="flex items-center gap-4 relative">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          Perfil
        </button>
        {showMenu && (
          <div className="absolute top-12 right-0 bg-white border rounded shadow p-4 z-50 min-w-[180px]">
            <button
              className="w-full text-left p-2 hover:bg-gray-100 text-black rounded"
              onClick={() => { setShowMenu(false); router.push('/usuario/perfil'); }}
            >Ver usuario</button>
            <div className="mt-2 text-sm text-gray-700">Nombre: {username || 'Usuario Ejemplo'}</div>
          </div>
        )}
        <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Salir</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
