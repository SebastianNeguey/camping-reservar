import React from 'react';
import UserLayout from '../componentes/UserLayout';

const ReservarPage: React.FC = () => {
  return (
    <UserLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Reservar</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-black">Aquí puedes realizar una reserva.</p>
      </div>
    </UserLayout>
  );
};

export default ReservarPage;
