import React from 'react';
import UserLayout from '../componentes/UserLayout';

const ReservasPage: React.FC = () => {
  return (
    <UserLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Tus Reservas</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-black">Aquí puedes ver tus reservas realizadas.</p>
      </div>
    </UserLayout>
  );
};

export default ReservasPage;
