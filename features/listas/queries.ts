import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { keys } from './keys';
import type { Hogar, Item, Lista } from './schema';

async function ensureHogar(userId: string): Promise<Hogar> {
  const { data: miembro, error: miembroError } = await supabase
    .from('hogar_miembros')
    .select('hogares(*)')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();
  if (miembroError) throw miembroError;
  const existente = (miembro as { hogares: Hogar } | null)?.hogares;
  if (existente) return existente;

  const { data: hogar, error: hogarError } = await supabase
    .from('hogares')
    .insert({ nombre: 'Mi hogar', created_by: userId })
    .select()
    .single();
  if (hogarError) throw hogarError;
  const nuevo = hogar as Hogar;

  const { error: unionError } = await supabase
    .from('hogar_miembros')
    .insert({ hogar_id: nuevo.id, user_id: userId });
  if (unionError) throw unionError;
  return nuevo;
}

export function useHogar(userId: string | undefined) {
  return useQuery({
    queryKey: keys.hogar(userId ?? ''),
    queryFn: () => ensureHogar(userId as string),
    enabled: Boolean(userId),
    staleTime: Infinity,
  });
}

export function useListas(hogarId: string | undefined) {
  return useQuery({
    queryKey: keys.listas(hogarId ?? ''),
    queryFn: async (): Promise<Lista[]> => {
      const { data, error } = await supabase
        .from('listas')
        .select('*')
        .eq('hogar_id', hogarId as string)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lista[];
    },
    enabled: Boolean(hogarId),
  });
}

export function useItems(listaId: string | undefined) {
  return useQuery({
    queryKey: keys.items(listaId ?? ''),
    queryFn: async (): Promise<Item[]> => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('lista_id', listaId as string)
        .order('comprado', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Item[];
    },
    enabled: Boolean(listaId),
  });
}
