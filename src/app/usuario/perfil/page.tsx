"use client";
import React, { useEffect, useState } from 'react';
import UserLayout from '../componentes/UserLayout';
import { getUserProfile, updateUserProfile } from '../../../lib/supabase/supabaseSession';

const PerfilUsuario: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      const data = await getUserProfile();
      setProfile(data);
      setUsername(data?.username || '');
      setEmail(data?.email || '');
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEdit(true);
    setSuccess('');
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { data, error } = await updateUserProfile({ username, email });
    if (error) {
      setError('No se pudo actualizar el perfil');
    } else {
      setProfile(data);
      setSuccess('Perfil actualizado');
      setEdit(false);
    }
  };

  if (loading) return <UserLayout><div className="p-8">Cargando...</div></UserLayout>;
  if (!profile) return <UserLayout><div className="p-8 text-red-500">No se pudo cargar el perfil</div></UserLayout>;

  return (
    <UserLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Perfil de Usuario</h1>
      <div className="bg-white rounded shadow p-6">
        {edit ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-black font-semibold mb-1">Nombre</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="border rounded p-2 w-full text-black" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Correo</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="border rounded p-2 w-full text-black" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Guardar</button>
            <button type="button" className="ml-2 bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEdit(false)}>Cancelar</button>
          </form>
        ) : (
          <>
            <p className="text-black"><span className="font-semibold">Nombre:</span> {profile.username}</p>
            <p className="text-black"><span className="font-semibold">Correo:</span> {profile.email}</p>
            <p className="text-black"><span className="font-semibold">Rol:</span> {profile.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500" onClick={handleEdit}>Editar perfil</button>
          </>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </div>
    </UserLayout>
  );
};

export default PerfilUsuario;
