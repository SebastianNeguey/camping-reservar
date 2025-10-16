"use client";
import React, { useState } from 'react';
import AdminLayout from '../componentes/AdminLayout';
import ClientesModal from '../../../components/ClientesModal';
import { getClienteByRut } from '../../../hooks/clientes';
import { Cliente } from '../../../types/clientes';
import { validateRut } from '../../../lib/validators';

const ReservarAdmin: React.FC = () => {
  const [form, setForm] = useState<Cliente>({ nombre: '', rut: '', telefono: '', correo: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clearMessages = () => { setMessage(null); setError(null); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const buscarPorRut = async () => {
    clearMessages();
    if (!form.rut) return setError('Ingrese un RUT para buscar');
    if (!validateRut(form.rut)) return setError('Formato de RUT inválido. Debe ser sin puntos y con guion, ej: 12345678-9');
    setLoading(true);
    const { data, error } = await getClienteByRut(form.rut);
    setLoading(false);
    if (error) return setError('Error al buscar cliente');
    if (!data) return setMessage('Cliente no encontrado');
    setForm({ id: data.id, nombre: data.nombre, rut: data.rut, telefono: data.telefono || '', correo: data.correo || '' });
    setMessage('Cliente cargado');
  };

  const handleSelectFromModal = (c: Cliente) => {
    setForm(c);
    setMessage('Cliente seleccionado');
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Reservar (Admin)</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded">Gestionar clientes</button>
      </div>

      <div className="bg-white rounded shadow p-6 max-w-2xl">
        <div className="mb-4">
          <label className="block font-semibold text-black">Buscar por RUT</label>
          <div className="flex gap-2 mt-2">
            <input name="rut" value={form.rut} onChange={handleChange} placeholder="12345678-9" className="border rounded p-2 flex-1 text-black" />
            <button onClick={buscarPorRut} className="bg-gray-800 text-white px-4 py-2 rounded">Buscar</button>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block font-semibold text-black">Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="border rounded p-2 w-full text-black" />
          </div>
          <div>
            <label className="block font-semibold text-black">RUT *</label>
            <input name="rut" value={form.rut} onChange={handleChange} className="border rounded p-2 w-full text-black" />
          </div>
          <div>
            <label className="block font-semibold text-black">Teléfono</label>
            <input name="telefono" value={form.telefono || ''} onChange={handleChange} className="border rounded p-2 w-full text-black" />
          </div>
          <div>
            <label className="block font-semibold text-black">Correo</label>
            <input name="correo" value={form.correo || ''} onChange={handleChange} className="border rounded p-2 w-full text-black" />
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded">Confirmar reserva</button>
            <button type="button" onClick={() => { setForm({ nombre: '', rut: '', telefono: '', correo: '' }); clearMessages(); }} className="bg-gray-400 text-white px-4 py-2 rounded">Limpiar</button>
          </div>
        </form>

        {loading && <p className="mt-4 text-gray-600">Procesando...</p>}
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>

      <ClientesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectFromModal} />
    </AdminLayout>
  );
};

export default ReservarAdmin;
