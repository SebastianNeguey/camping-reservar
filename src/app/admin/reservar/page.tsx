"use client";
import React, { useState, useEffect } from 'react';
import AdminLayout from '../componentes/AdminLayout';
import ClientesModal from '../../../components/ClientesModal';
import { getClienteByRut } from '../../../hooks/clientes';
import { Cliente } from '../../../types/clientes';
import { validateRut } from '../../../lib/validators';
import { supabase } from '../../../lib/supabase/supabaseClient';
import { Puesto } from '../../../types/puestos';

const TIPOS = ['con_meson', 'sin_meson', 'con_panchos'];

const ReservarAdmin: React.FC = () => {
  const [form, setForm] = useState<Cliente>({ nombre: '', rut: '', telefono: '', correo: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clearMessages = () => { setMessage(null); setError(null); };
  const normalizeRutInput = (value: string) => value.replace(/\./g, '');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'rut' ? normalizeRutInput(value) : value });
  };

  const [tipo, setTipo] = useState<string>(TIPOS[0]);
  const [checkIn, setCheckIn] = useState<string>('');
  const [puestosDisponibles, setPuestosDisponibles] = useState<Puesto[]>([]);

  async function loadPuestosDisponibles() {
    if (!checkIn || !tipo) return setPuestosDisponibles([]);
    // compute 24h window
    const date = new Date(checkIn);
    const start = new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString();

    // Get reserved puesto_ids in the window
    const { data: reservasData, error: reservasErr } = await supabase
      .from('reservas')
      .select('puesto_id,check_in')
      .or(`check_in.gte.${start},check_in.lte.${end}`);

    if (reservasErr) return setError('Error consultando reservas');

    const reservedIds = (reservasData ?? []).map((r: any) => r.puesto_id).filter(Boolean);

    // Query puestos of the selected type excluding reservedIds
    let query = supabase.from('puestos').select('*').eq('tipo', tipo);
    if (reservedIds.length) query = query.not('id', 'in', `(${reservedIds.join(',')})`);
    const { data: puestosData, error: puestosErr } = await query;
    if (puestosErr) return setError('Error consultando puestos');
    setPuestosDisponibles(puestosData ?? []);
  }

  // Ejecutar búsqueda automáticamente cuando cambian tipo o checkIn
  useEffect(() => {
    if (tipo && checkIn) {
      // no await directly in useEffect callback
      loadPuestosDisponibles();
    } else {
      setPuestosDisponibles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, checkIn]);

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
      {/* cabecera: botones movidos al formulario */}

      <div className="bg-white rounded shadow p-6 w-full">
        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Izquierda: datos del cliente */}
          <div>
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
                <input name="nombre" value={form.nombre} onChange={handleChange} readOnly className="border rounded p-2 w-full text-black bg-gray-100" />
              </div>
              <div>
                <label className="block font-semibold text-black">RUT *</label>
                <input name="rut" value={form.rut} onChange={handleChange} readOnly className="border rounded p-2 w-full text-black bg-gray-100" />
              </div>
              <div>
                <label className="block font-semibold text-black">Teléfono</label>
                <input name="telefono" value={form.telefono || ''} onChange={handleChange} readOnly className="border rounded p-2 w-full text-black bg-gray-100" />
              </div>
              <div>
                <label className="block font-semibold text-black">Correo</label>
                <input name="correo" value={form.correo || ''} onChange={handleChange} readOnly className="border rounded p-2 w-full text-black bg-gray-100" />
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded">Confirmar reserva</button>
                <button type="button" onClick={() => { setIsModalOpen(true); }} className="bg-green-600 text-white px-4 py-2 rounded">Agregar clientes</button>
                <button type="button" onClick={() => { setIsModalOpen(true); }} className="bg-yellow-500 text-white px-4 py-2 rounded">Editar cliente</button>
                <button type="button" onClick={() => { setForm({ nombre: '', rut: '', telefono: '', correo: '' }); clearMessages(); }} className="bg-gray-400 text-white px-4 py-2 rounded">Limpiar</button>
              </div>
            </form>
          </div>

          {/* Derecha: buscar puestos */}
          <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-semibold text-black">Fecha</label>
                  <input type="datetime-local" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="border rounded p-2 w-full text-black" />
                </div>
                <div>
                  <label className="block font-semibold text-black">Tipo</label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="border rounded p-2 w-full text-black">
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-semibold text-black">Puesto</label>
                <select value={String(form.id || '')} onChange={(e) => setForm({ ...form, id: Number(e.target.value) })} className="border rounded p-2 w-full text-black">
                  <option value="">-- Seleccione --</option>
                  {puestosDisponibles.map(p => <option key={p.id} value={p.id}>{p.codigo} - {p.nombre}</option>)}
                </select>
              </div>

              <p className="text-sm text-gray-600">La búsqueda de puestos se ejecuta automáticamente cuando tenga Fecha y Tipo.</p>
              <div className="flex justify-center mt-4">
                <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded">Confirmar reserva</button>
              </div>
          </div>
        </div>

        {loading && <p className="mt-4 text-gray-600">Procesando...</p>}
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>

  <ClientesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectFromModal} initial={form} />
    </AdminLayout>
  );
};

export default ReservarAdmin;
