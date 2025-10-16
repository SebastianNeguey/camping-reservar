import React from 'react';
import AdminLayout from '../componentes/AdminLayout';
import Link from 'next/link';

const ReservasAdminList: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Reservas (Admin)</h1>
      <div className="bg-white rounded shadow p-6 max-w-2xl">
        <p className="text-black mb-4">Listado de reservas. Aquí podrías mostrar una tabla con todas las reservas.</p>
        <Link href="/admin/reservar" className="bg-blue-600 text-white px-4 py-2 rounded">Ir a Reservar</Link>
      </div>
    </AdminLayout>
  );
};

export default ReservasAdminList;
