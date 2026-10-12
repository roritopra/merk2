import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { keys } from './keys';
import type { Hogar, Item, Lista } from './schema';

async function ensureHogar(): Promise<Hogar> {
  // RPC atómico (ver supabase/migrations/20261012_ensure_hogar_rpc.sql):
  // devuelve el hogar existente o crea hogar + membresía en una transacción.
  const { data, error } = await supabase.rpc('ensure_hogar');
  if (error) throw error;
  return data as Hogar;
}

export function useHogar(userId: string | undefined) {
  return useQuery({
    queryKey: keys.hogar(userId ?? ''),
    queryFn: () => ensureHogar(),
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
