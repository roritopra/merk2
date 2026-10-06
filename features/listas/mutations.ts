import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { keys } from './keys';
import type { Item } from './schema';

export function useCreateLista(hogarId: string | undefined, userId: string | undefined) {
  return useMutation({
    mutationFn: async (nombre: string) => {
      const { error } = await supabase.from('listas').insert({
        hogar_id: hogarId as string,
        nombre: nombre.trim(),
        created_by: userId as string,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.listas(hogarId ?? '') });
    },
  });
}

export function useAddItem(listaId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nombre: string) => {
      const { error } = await supabase.from('items').insert({
        lista_id: listaId,
        nombre: nombre.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.items(listaId) });
    },
  });
}

export function useToggleItem(listaId: string, userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Item) => {
      const comprado = !item.comprado;
      const { error } = await supabase
        .from('items')
        .update({
          comprado,
          comprado_por: comprado ? (userId as string) : null,
          comprado_at: comprado ? new Date().toISOString() : null,
        })
        .eq('id', item.id);
      if (error) throw error;
    },
    onMutate: async (item: Item) => {
      await qc.cancelQueries({ queryKey: keys.items(listaId) });
      const previo = qc.getQueryData<Item[]>(keys.items(listaId));
      const comprado = !item.comprado;
      qc.setQueryData<Item[]>(keys.items(listaId), (actual) =>
        (actual ?? []).map((it) =>
          it.id === item.id
            ? { ...it, comprado, comprado_por: comprado ? (userId as string) : null }
            : it
        )
      );
      return { previo };
    },
    onError: (_err, _item, contexto) => {
      if (contexto?.previo) qc.setQueryData(keys.items(listaId), contexto.previo);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: keys.items(listaId) });
    },
  });
}

export function useCerrarLista(hogarId: string | undefined) {
  return useMutation({
    mutationFn: async (listaId: string) => {
      const { error } = await supabase
        .from('listas')
        .update({ estado: 'cerrada' })
        .eq('id', listaId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.listas(hogarId ?? '') });
    },
  });
}
