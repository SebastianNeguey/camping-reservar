import React from 'react';
import AdminLayout from '../componentes/AdminLayout';

const PerfilAdmin: React.FC = () => {
  // Simulación de datos de admin
  const admin = {
    nombre: 'Administrador Ejemplo',
    correo: 'admin@ejemplo.com',
    rol: 'Administrador',
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Perfil de Administrador</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-black"><span className="font-semibold">Nombre:</span> {admin.nombre}</p>
        <p className="text-black"><span className="font-semibold">Correo:</span> {admin.correo}</p>
        <p className="text-black"><span className="font-semibold">Rol:</span> {admin.rol}</p>
      </div>
    </AdminLayout>
  );
};

export default PerfilAdmin;
