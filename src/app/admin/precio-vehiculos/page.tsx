"use client";
import React, { useEffect, useState } from 'react';
import AdminLayout from '../componentes/AdminLayout';
import { TipoVehiculo } from '../../../types/tiposVehiculos';
import { listTiposVehiculos, createTipoVehiculo, updateTipoVehiculo, deleteTipoVehiculo } from '../../../hooks/tiposVehiculos';
import TipoVehiculoModal from '../../../components/TipoVehiculoModal';

const PrecioVehiculos: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<TipoVehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<TipoVehiculo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVehiculos();
  }, []);

  async function loadVehiculos() {
    setLoading(true);
    const { data, error } = await listTiposVehiculos();
    if (error) {
      setError(error.message || 'Error cargando tipos de vehículos');
    } else {
      setVehiculos(data ?? []);
    }
    setLoading(false);
  }

  async function handleEdit(v: TipoVehiculo) {
    setModalInitial(v);
    setModalOpen(true);
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar tipo de vehículo?')) return;
    const { error } = await deleteTipoVehiculo(id);
    if (error) setError(error.message || 'Error eliminando');
    else await loadVehiculos();
  }

  const handleModalSave = async (v: TipoVehiculo) => {
    if (v.id) {
      const { error } = await updateTipoVehiculo(v.id, v);
      if (error) return setError(error.message || 'Error actualizando');
    } else {
      const { error } = await createTipoVehiculo(v);
      if (error) return setError(error.message || 'Error creando');
    }
    await loadVehiculos();
    setModalOpen(false);
    setModalInitial(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-6 text-black">
        <h1 className="text-2xl font-bold mb-4 text-black">Precio Vehículos</h1>
        <div className="mb-6 flex justify-between items-center">
          <div />
          <div>
            <button onClick={() => { setModalInitial(null); setModalOpen(true); }} className="bg-green-600 text-white px-4 py-2 rounded">Nuevo tipo de vehículo</button>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-3 text-black">Lista de tipos de vehículos</h2>
          <TipoVehiculoModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setModalInitial(null); }} onSave={handleModalSave} initial={modalInitial} />
          {loading ? <p>Cargando...</p> : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="border p-2">Nombre</th>
                  <th className="border p-2">Precio base</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.map(v => (
                  <tr key={v.id}>
                    <td className="border p-2">{v.nombre}</td>
                    <td className="border p-2">{v.precio_base}</td>
                    <td className="border p-2">
                      <button onClick={() => handleEdit(v)} className="mr-2 bg-yellow-400 px-2 py-1 rounded">Editar</button>
                      <button onClick={() => handleDelete(v.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
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

export default PrecioVehiculos;
