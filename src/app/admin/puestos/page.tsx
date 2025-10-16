"use client";
import React, { useEffect, useState } from 'react';
import AdminLayout from '../componentes/AdminLayout';
import { Puesto } from '../../../types/puestos';
import { listPuestos, createPuesto, updatePuesto, deletePuesto } from '../../../hooks/puestos';
import PuestoModal from '../../../components/PuestoModal';

const PuestosAdminPage: React.FC = () => {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Puesto | null>(null);
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

  async function handleEdit(p: Puesto) {
    setModalInitial(p);
    setModalOpen(true);
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar puesto?')) return;
    const { error } = await deletePuesto(id);
    if (error) setError(error.message || 'Error eliminando');
    else await loadPuestos();
  }

  const handleModalSave = async (p: Puesto) => {
    if (p.id) {
      const { error } = await updatePuesto(p.id, p);
      if (error) return setError(error.message || 'Error actualizando');
    } else {
      const { error } = await createPuesto(p);
      if (error) return setError(error.message || 'Error creando');
    }
    await loadPuestos();
    setModalOpen(false);
    setModalInitial(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-6 text-black">
        <h1 className="text-2xl font-bold mb-4 text-black">Gestionar Puestos</h1>
        <div className="mb-6 flex justify-between items-center">
          <div />
          <div>
            <button onClick={() => { setModalInitial(null); setModalOpen(true); }} className="bg-green-600 text-white px-4 py-2 rounded">Nuevo puesto</button>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-3 text-black">Lista de puestos</h2>
          <PuestoModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setModalInitial(null); }} onSave={handleModalSave} initial={modalInitial} />
          {loading ? <p>Cargando...</p> : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left">
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
