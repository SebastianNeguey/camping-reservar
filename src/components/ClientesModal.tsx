"use client";
import React, { useEffect, useState } from 'react';
import { listClientes, getClienteByRut, createCliente, updateCliente, deleteCliente } from '../hooks/clientes';
import { Cliente } from '../types/clientes';
import { validateRut } from '../lib/validators';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (cliente: Cliente) => void;
};

export default function ClientesModal({ isOpen, onClose, onSelect }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [rutSearch, setRutSearch] = useState('');
  const [form, setForm] = useState<Cliente>({ nombre: '', rut: '', telefono: '', correo: '' });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await listClientes();
    setClientes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  const handleBuscar = async () => {
    setError(null); setMessage(null);
    if (!rutSearch) return setError('Ingrese RUT');
    if (!validateRut(rutSearch)) return setError('Formato de RUT inválido');
    setLoading(true);
    const { data, error } = await getClienteByRut(rutSearch);
    setLoading(false);
    if (error) return setError('Error al buscar cliente');
    if (!data) return setMessage('Cliente no encontrado');
    setForm({ id: data.id, nombre: data.nombre, rut: data.rut, telefono: data.telefono || '', correo: data.correo || '' });
  };

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
    } else {
      const { data, error } = await createCliente(form);
      setLoading(false);
      if (error) return setError('Error al crear: ' + error.message);
      setMessage('Cliente creado');
      setForm({ nombre: '', rut: '', telefono: '', correo: '' });
    }
    load();
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
    load();
  };

  const handleSelect = (c: Cliente) => {
    onSelect(c);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-3xl text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Gestionar Clientes</h2>
          <button onClick={onClose} className="text-gray-600">Cerrar</button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <input placeholder="Buscar por RUT" value={rutSearch} onChange={(e) => setRutSearch(e.target.value)} className="border p-2 flex-1" />
            <button onClick={handleBuscar} className="bg-gray-800 text-white px-4 py-2 rounded">Buscar</button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Listado</h3>
            {loading ? <p className="text-black">Cargando...</p> : (
              <ul className="space-y-2 max-h-72 overflow-auto">
                {clientes.map(c => (
                  <li key={c.id} className="border rounded p-2 flex justify-between items-center">
                    <div>
                        <div className="font-medium">{c.nombre}</div>
                        <div className="text-sm text-black">{c.rut} · {c.telefono || ''}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setForm(c)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                      <button onClick={() => handleSelect(c)} className="bg-blue-600 text-white px-2 py-1 rounded">Seleccionar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Crear / Editar</h3>
            <form onSubmit={handleCreateOrUpdate} className="space-y-2">
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
      </div>
    </div>
  );
}
