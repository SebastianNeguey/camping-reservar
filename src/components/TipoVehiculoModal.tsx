"use client";
import React, { useState, useEffect } from 'react';
import { TipoVehiculo } from '../types/tiposVehiculos';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (v: TipoVehiculo) => Promise<void> | void;
  initial?: TipoVehiculo | null;
};

const VehiculoModal: React.FC<Props> = ({ isOpen, onClose, onSave, initial = null }) => {
  const [form, setForm] = useState<TipoVehiculo>({ nombre: '', precio_base: 0 });
  const [precioInput, setPrecioInput] = useState<string>('0');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setPrecioInput(String(initial.precio_base ?? 0));
    } else {
      setForm({ nombre: '', precio_base: 0 });
      setPrecioInput('0');
    }
    setError('');
  }, [initial, isOpen]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError('');
    const normalized = precioInput.replace(/^0+(?=\d)/, '');
    const precioNum = Number(normalized === '' ? 0 : normalized);
    if (!form.nombre.trim()) return setError('Nombre requerido');
    if (isNaN(precioNum) || precioNum <= 0) return setError('Precio debe ser mayor a 0');
    await onSave({ ...form, precio_base: precioNum });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-lg text-black">
        <h3 className="text-xl font-semibold mb-4">{initial ? 'Editar tipo de vehículo' : 'Nuevo tipo de vehículo'}</h3>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Nombre</label>
              <input 
                value={form.nombre} 
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
                className="mt-1 block w-full border rounded p-2 text-black" 
                placeholder="Ej: Auto, Camioneta, Moto"
              />
            </div>
            <div>
              <label className="block text-sm">Precio base</label>
              <input 
                type="number" 
                value={precioInput} 
                onChange={(e) => setPrecioInput(e.target.value)} 
                onBlur={(e) => setPrecioInput(String(Number(e.target.value.replace(/^0+(?=\d)/, '') || 0)))} 
                className="mt-1 block w-full border rounded p-2 text-black" 
              />
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

export default VehiculoModal;
