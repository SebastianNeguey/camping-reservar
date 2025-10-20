"use client";
import { supabase } from "../lib/supabase/supabaseClient";
import { TipoVehiculo } from "../types/tiposVehiculos";

export async function listTiposVehiculos() {
  const { data, error } = await supabase.from('tipos_vehiculos').select('*').order('nombre', { ascending: true });
  return { data, error };
}

export async function getTipoVehiculoById(id: number) {
  const { data, error } = await supabase.from('tipos_vehiculos').select('*').eq('id', id).maybeSingle();
  return { data, error };
}

export async function createTipoVehiculo(vehiculo: TipoVehiculo) {
  const { data, error } = await supabase.from('tipos_vehiculos').insert([vehiculo]).select();
  return { data, error };
}

export async function updateTipoVehiculo(id: number, updates: Partial<TipoVehiculo>) {
  const { data, error } = await supabase.from('tipos_vehiculos').update(updates).eq('id', id).select().single();
  return { data, error };
}

export async function deleteTipoVehiculo(id: number) {
  const { data, error } = await supabase.from('tipos_vehiculos').delete().eq('id', id);
  return { data, error };
}
