import React from 'react';
import UserLayout from '../componentes/UserLayout';
import Link from 'next/link';

const ReservasUsuarioList: React.FC = () => {
  return (
    <UserLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Tus Reservas</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-black mb-4">Listado de tus reservas. Aquí podrías mostrar tus reservas guardadas.</p>
        <Link href="/usuario/reservar" className="bg-blue-600 text-white px-4 py-2 rounded">Ir a Reservar</Link>
      </div>
    </UserLayout>
  );
};

export default ReservasUsuarioList;
