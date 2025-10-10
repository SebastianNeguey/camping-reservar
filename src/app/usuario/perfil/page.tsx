import React from 'react';
import UserLayout from '../componentes/UserLayout';

const PerfilUsuario: React.FC = () => {
  // Simulación de datos de usuario
  const usuario = {
    nombre: 'Usuario Ejemplo',
    correo: 'usuario@ejemplo.com',
    rol: 'Usuario',
  };

  return (
    <UserLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Perfil de Usuario</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-black"><span className="font-semibold">Nombre:</span> {usuario.nombre}</p>
        <p className="text-black"><span className="font-semibold">Correo:</span> {usuario.correo}</p>
        <p className="text-black"><span className="font-semibold">Rol:</span> {usuario.rol}</p>
      </div>
    </UserLayout>
  );
};

export default PerfilUsuario;
