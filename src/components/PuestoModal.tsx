"use client";
import React, { useState, useEffect } from 'react';
import { Puesto } from '../types/puestos';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Puesto) => Promise<void> | void;
  initial?: Puesto | null;
};

const TIPOS: Puesto['tipo'][] = ['con_meson', 'sin_meson', 'con_panchos', 'acampar'];

const PuestoModal: React.FC<Props> = ({ isOpen, onClose, onSave, initial = null }) => {
  const [form, setForm] = useState<Puesto>({ codigo: '', nombre: '', tipo: TIPOS[0], precio_base: 0 });
  const [precioInput, setPrecioInput] = useState<string>('0');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setPrecioInput(String(initial.precio_base ?? 0));
    } else {
      setForm({ codigo: '', nombre: '', tipo: TIPOS[0], precio_base: 0 });
      setPrecioInput('0');
    }
    setError('');
  }, [initial, isOpen]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError('');
    const normalized = precioInput.replace(/^0+(?=\d)/, '');
    const precioNum = Number(normalized === '' ? 0 : normalized);
    if (!form.codigo.trim() || !form.nombre.trim()) return setError('Codigo y nombre requeridos');
    if (isNaN(precioNum)) return setError('Precio inválido');
    await onSave({ ...form, precio_base: precioNum });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-lg text-black">
        <h3 className="text-xl font-semibold mb-4">{initial ? 'Editar puesto' : 'Nuevo puesto'}</h3>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Código</label>
              <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} className="mt-1 block w-full border rounded p-2 text-black" />
            </div>
            <div>
              <label className="block text-sm">Nombre</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="mt-1 block w-full border rounded p-2 text-black" />
            </div>
            <div>
              <label className="block text-sm">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as Puesto['tipo'] })} className="mt-1 block w-full border rounded p-2 text-black">
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">Precio base</label>
              <input type="number" value={precioInput} onChange={(e) => setPrecioInput(e.target.value)} onBlur={(e) => setPrecioInput(String(Number(e.target.value.replace(/^0+(?=\d)/, '') || 0)))} className="mt-1 block w-full border rounded p-2 text-black" />
            </div>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PuestoModal;
