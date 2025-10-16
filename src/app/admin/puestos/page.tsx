"use client";
import React, { useEffect, useState } from 'react';
import AdminLayout from '../componentes/AdminLayout';
import { Puesto } from '../../../types/puestos';
import { listPuestos, createPuesto, updatePuesto, deletePuesto } from '../../../hooks/puestos';

const TIPOS: Puesto['tipo'][] = ['con_meson', 'sin_meson', 'con_panchos', 'acampar'];

const PuestosAdminPage: React.FC = () => {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Puesto>({ codigo: '', nombre: '', tipo: TIPOS[0], precio_base: 0 });
  const [precioInput, setPrecioInput] = useState<string>(String(0));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPuestos();
  }, []);

  async function loadPuestos() {
    setLoading(true);
    const { data, error } = await listPuestos();
    if (error) {
      setError(error.message || 'Error cargando puestos');
    } else {
      setPuestos(data ?? []);
    }
    setLoading(false);
  }

  function resetForm() {
  setForm({ codigo: '', nombre: '', tipo: TIPOS[0], precio_base: 0 });
    setPrecioInput(String(0));
    setEditingId(null);
    setError('');
  }

  async function handleSave(e?: React.FormEvent) {
    e?.preventDefault();
    setError('');
    // Normalizar precioInput y usar ese valor
    const normalized = precioInput.replace(/^0+(?=\d)/, '');
    const precioNum = Number(normalized === '' ? 0 : normalized);

    // Validaciones simples
    if (!form.codigo.trim() || !form.nombre.trim()) {
      setError('Codigo y nombre son requeridos');
      return;
    }
    if (isNaN(precioNum)) {
      setError('Precio base inválido');
      return;
    }

    if (editingId) {
      const { data, error } = await updatePuesto(editingId, {
        codigo: form.codigo,
        nombre: form.nombre,
        tipo: form.tipo,
        precio_base: precioNum,
      });
      if (error) setError(error.message || 'Error actualizando');
      else {
        await loadPuestos();
        resetForm();
      }
    } else {
      const { data, error } = await createPuesto({ ...form, precio_base: precioNum });
      if (error) setError(error.message || 'Error creando puesto');
      else {
        await loadPuestos();
        resetForm();
      }
    }
  }

  async function handleEdit(p: Puesto) {
    setEditingId(p.id ?? null);
    setForm({ codigo: p.codigo, nombre: p.nombre, tipo: p.tipo, precio_base: p.precio_base });
    setPrecioInput(String(p.precio_base ?? 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar puesto?')) return;
    const { error } = await deletePuesto(id);
    if (error) setError(error.message || 'Error eliminando');
    else await loadPuestos();
  }

  function handlePrecioKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const key = e.key;
    // only handle single digit keys
    if (!/^[0-9]$/.test(key)) return;
    const input = e.currentTarget;
    const curr = String(form.precio_base ?? '');
    const selectionStart = input.selectionStart ?? 0;
    const selectionEnd = input.selectionEnd ?? 0;

    const isAllSelected = selectionStart === 0 && selectionEnd === curr.length;
    const caretAtEnd = selectionStart === selectionEnd && selectionStart === curr.length;

    if (curr === '0' && (isAllSelected || caretAtEnd)) {
      // replace leading zero with the typed digit
      e.preventDefault();
      setForm({ ...form, precio_base: Number(key) });
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-6 text-black">
        <h1 className="text-2xl font-bold mb-4 text-black">Gestionar Puestos</h1>

        <form onSubmit={(e) => handleSave(e)} className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Código</label>
              <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} className="mt-1 block w-full border rounded p-2 text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="mt-1 block w-full border rounded p-2 text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as Puesto['tipo'] })} className="mt-1 block w-full border rounded p-2 text-black">
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio base</label>
              <input
                type="number"
                value={precioInput}
                onChange={(e) => {
                  setPrecioInput(e.target.value);
                }}
                onKeyDown={handlePrecioKeyDown}
                onBlur={(e) => {
                  const normalized = e.target.value.replace(/^0+(?=\d)/, '');
                  const num = Number(normalized === '' ? 0 : normalized);
                  setForm((prev) => ({ ...prev, precio_base: num }));
                  setPrecioInput(String(num));
                }}
                className="mt-1 block w-full border rounded p-2 text-black"
              />
            </div>
          </div>

          {error && <p className="text-red-600 mt-3">{error}</p>}

          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={resetForm} className="bg-gray-200 px-4 py-2 rounded">Limpiar</button>
          </div>
        </form>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-3 text-black">Lista de puestos</h2>
          {loading ? <p>Cargando...</p> : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Código</th>
                  <th className="border p-2">Nombre</th>
                  <th className="border p-2">Tipo</th>
                  <th className="border p-2">Precio base</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {puestos.map(p => (
                  <tr key={p.id}>
                    <td className="border p-2">{p.id}</td>
                    <td className="border p-2">{p.codigo}</td>
                    <td className="border p-2">{p.nombre}</td>
                    <td className="border p-2">{p.tipo}</td>
                    <td className="border p-2">{p.precio_base}</td>
                    <td className="border p-2">
                      <button onClick={() => handleEdit(p)} className="mr-2 bg-yellow-400 px-2 py-1 rounded">Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PuestosAdminPage;
