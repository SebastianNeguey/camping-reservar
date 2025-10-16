"use client";
import { supabase } from "../lib/supabase/supabaseClient";
import { Puesto } from "../types/puestos";

export async function listPuestos() {
  const { data, error } = await supabase.from('puestos').select('*').order('id', { ascending: true });
  return { data, error };
}

export async function getPuestoById(id: number) {
  const { data, error } = await supabase.from('puestos').select('*').eq('id', id).maybeSingle();
  return { data, error };
}

export async function createPuesto(puesto: Puesto) {
  const { data, error } = await supabase.from('puestos').insert([puesto]).select();
  return { data, error };
}

export async function updatePuesto(id: number, updates: Partial<Puesto>) {
  const { data, error } = await supabase.from('puestos').update(updates).eq('id', id).select().single();
  return { data, error };
}

export async function deletePuesto(id: number) {
  const { data, error } = await supabase.from('puestos').delete().eq('id', id);
  return { data, error };
}
