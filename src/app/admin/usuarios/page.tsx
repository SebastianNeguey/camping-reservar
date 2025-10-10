import React from 'react';
import AdminLayout from '../componentes/AdminLayout';

const UsuariosAdmin: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Usuarios (Admin)</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-black">Aquí puedes ver y gestionar los usuarios registrados.</p>
      </div>
    </AdminLayout>
  );
};

export default UsuariosAdmin;
