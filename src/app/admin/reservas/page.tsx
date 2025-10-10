import React from 'react';
import AdminLayout from '../componentes/AdminLayout';

const ReservasAdmin: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Reservas (Admin)</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-black">Aquí puedes ver y gestionar las reservas como administrador.</p>
      </div>
    </AdminLayout>
  );
};

export default ReservasAdmin;
