import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { recordarTienda } from '@/features/tiendas/mutations';
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

export function useAddItem(listaId: string, hogarId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { nombre: string; tiendaId: string | null }) => {
      const { error } = await supabase.from('items').insert({
        lista_id: listaId,
        nombre: input.nombre.trim(),
        tienda_id: input.tiendaId,
      });
      if (error) throw error;
      if (input.tiendaId && hogarId) {
        await recordarTienda(hogarId, input.nombre, input.tiendaId);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.items(listaId) });
    },
  });
}

export function useAssignTienda(listaId: string, hogarId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { item: Item; tiendaId: string | null }) => {
      const { error } = await supabase
        .from('items')
        .update({ tienda_id: input.tiendaId })
        .eq('id', input.item.id);
      if (error) throw error;
      if (input.tiendaId && hogarId) {
        await recordarTienda(hogarId, input.item.nombre, input.tiendaId);
      }
    },
    onMutate: async (input: { item: Item; tiendaId: string | null }) => {
      await qc.cancelQueries({ queryKey: keys.items(listaId) });
      const previo = qc.getQueryData<Item[]>(keys.items(listaId));
      qc.setQueryData<Item[]>(keys.items(listaId), (actual) =>
        (actual ?? []).map((it) =>
          it.id === input.item.id ? { ...it, tienda_id: input.tiendaId } : it
        )
      );
      return { previo };
    },
    onError: (_err, _input, contexto) => {
      if (contexto?.previo) qc.setQueryData(keys.items(listaId), contexto.previo);
    },
    onSettled: () => {
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
