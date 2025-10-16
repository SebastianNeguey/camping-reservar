"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="font-bold text-lg">Panel Admin</span>
        <button onClick={toggleSidebar} className="absolute top-4 -right-6 p-2 bg-gray-700 text-white rounded hover:bg-gray-600">
          {isOpen ? '⟨' : '⟩'}
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => router.push('/admin')}>Dashboard</li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => router.push('/admin/reservas')}>Reservas</li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => router.push('/admin/usuarios')}>Usuarios</li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => router.push('/admin/puestos')}>Gestionar puestos</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
