"use client";
import React from 'react';
import UserLayout from './componentes/UserLayout';

const UsuarioPage: React.FC = () => {
  return (
    <UserLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Bienvenido Usuario</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-black">Accede a reservar o ver tus reservas usando el menú.</p>
      </div>
    </UserLayout>
  );
};

export default UsuarioPage;
