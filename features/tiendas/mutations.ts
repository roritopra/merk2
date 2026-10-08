import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { normalizarProducto } from '@/lib/productos';
import { keysTiendas } from './keys';

export function useCreateTienda(hogarId: string | undefined, userId: string | undefined) {
  const qc = useQueryClient();
  void userId;
  return useMutation({
    mutationFn: async (nombre: string) => {
      const { error } = await supabase.from('tiendas').insert({
        hogar_id: hogarId as string,
        nombre: nombre.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keysTiendas.todas(hogarId ?? '') });
    },
  });
}

export function useDeleteTienda(hogarId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tiendaId: string) => {
      const { error } = await supabase.from('tiendas').delete().eq('id', tiendaId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keysTiendas.todas(hogarId ?? '') });
    },
  });
}

export async function recordarTienda(
  hogarId: string,
  nombreProducto: string,
  tiendaId: string
): Promise<void> {
  const producto = normalizarProducto(nombreProducto);
  if (!producto) return;
  const { error } = await supabase.from('producto_memoria').upsert(
    { hogar_id: hogarId, producto, tienda_id: tiendaId },
    { onConflict: 'hogar_id,producto' }
  );
  if (error) throw error;
}
