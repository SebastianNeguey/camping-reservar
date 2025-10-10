"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

interface UserSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-blue-600 text-white w-64 transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <span className="font-bold text-lg">Usuario</span>
        <button onClick={toggleSidebar} className="absolute top-4 -right-6 p-2 bg-blue-700 rounded hover:bg-white-600 text-blue-200">
          {isOpen ? '⟨' : '⟩'}
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          <li className="p-4 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/usuario/reservar')}>Reservar</li>
          <li className="p-4 hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/usuario/reservas')}>Ver Reservas</li>
        </ul>
      </nav>
    </aside>
  );
};

export default UserSidebar;
