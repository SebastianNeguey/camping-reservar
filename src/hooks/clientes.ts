"use client";
import { supabase } from "../lib/supabase/supabaseClient";
import { Cliente } from "../types/clientes";
import { validateRut } from "../lib/validators";

export async function listClientes() {
  const { data, error } = await supabase.from('clientes').select('*').order('id', { ascending: true });
  return { data, error };
}

export async function getClienteByRut(rut: string) {
  const { data, error } = await supabase.from('clientes').select('*').eq('rut', rut).maybeSingle();
  return { data, error };
}

export async function createCliente(cliente: Cliente) {
  const { data, error } = await supabase.from('clientes').insert([cliente]);
  return { data, error };
}

export async function updateCliente(id: number, cliente: Partial<Cliente>) {
  const { data, error } = await supabase.from('clientes').update(cliente).eq('id', id).select().single();
  return { data, error };
}

export async function deleteCliente(id: number) {
  const { data, error } = await supabase.from('clientes').delete().eq('id', id);
  return { data, error };
}
