"use client";
import React, { useEffect, useState } from 'react';
import { getClienteByRut, createCliente, updateCliente, deleteCliente } from '../hooks/clientes';
import { Cliente } from '../types/clientes';
import { validateRut } from '../lib/validators';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (cliente: Cliente) => void;
  // optional initial cliente to edit
  initial?: Cliente | null;
};

export default function ClientesModal({ isOpen, onClose, onSelect, initial }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Cliente>({ nombre: '', rut: '', telefono: '', correo: '' });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initial) setForm(initial);
      else setForm({ nombre: '', rut: '', telefono: '', correo: '' });
      setError(null);
      setMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initial]);
  const handleCreateOrUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null); setMessage(null);
    if (!form.nombre.trim()) return setError('Nombre obligatorio');
    if (!form.rut.trim()) return setError('RUT obligatorio');
    if (!validateRut(form.rut)) return setError('Formato de RUT inválido');
    setLoading(true);
    if (form.id) {
      const { data, error } = await updateCliente(form.id, form);
      setLoading(false);
      if (error) return setError('Error al actualizar: ' + error.message);
      setMessage('Cliente actualizado');
      // propagar cliente actualizado al padre
      if (data) onSelect(data as Cliente);
    } else {
      const { data, error } = await createCliente(form);
      setLoading(false);
      if (error) return setError('Error al crear: ' + error.message);
      // intentar recuperar el cliente creado por RUT
      const { data: fetched } = await getClienteByRut(form.rut);
      if (fetched) {
        setMessage('Cliente creado');
        onSelect(fetched);
      } else {
        setMessage('Cliente creado (no se pudo recuperar)');
      }
      setForm({ nombre: '', rut: '', telefono: '', correo: '' });
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return setError('Seleccione un cliente para eliminar');
    if (!confirm('¿Eliminar cliente?')) return;
    setLoading(true);
    const { error } = await deleteCliente(id);
    setLoading(false);
    if (error) return setError('Error al eliminar: ' + error.message);
    setMessage('Cliente eliminado');
    setForm({ nombre: '', rut: '', telefono: '', correo: '' });
  };

  const handleSelect = (c: Cliente) => {
    onSelect(c);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Clientes</h2>
          <button onClick={onClose} className="text-gray-600">Cerrar</button>
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}
        {message && <p className="text-green-600 mt-2">{message}</p>}

        <form onSubmit={handleCreateOrUpdate} className="space-y-2 mt-4">
          <div>
            <label className="block text-sm font-medium text-black">Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="border p-2 w-full text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">RUT</label>
            <input value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} className="border p-2 w-full text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Teléfono</label>
            <input value={form.telefono || ''} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="border p-2 w-full text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Correo</label>
            <input value={form.correo || ''} onChange={(e) => setForm({ ...form, correo: e.target.value })} className="border p-2 w-full text-black" />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{form.id ? 'Actualizar' : 'Crear'}</button>
            {form.id && <button type="button" onClick={() => handleDelete(form.id)} className="bg-red-600 text-white px-4 py-2 rounded">Eliminar</button>}
            <button type="button" onClick={() => setForm({ nombre: '', rut: '', telefono: '', correo: '' })} className="bg-gray-400 text-white px-4 py-2 rounded">Limpiar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
