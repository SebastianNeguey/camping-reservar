import React from 'react';
import AdminLayout from './componentes/AdminLayout';

const AdminPage: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Bienvenido al Panel de Administración</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-black">Este es el área principal del panel. Aquí puedes agregar widgets, tablas, gráficos, etc.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
