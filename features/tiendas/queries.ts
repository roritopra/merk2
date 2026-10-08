import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { normalizarProducto } from '@/lib/productos';
import { keysTiendas } from './keys';
import type { MemoriaProducto, Tienda } from './schema';

export function useTiendas(hogarId: string | undefined) {
  return useQuery({
    queryKey: keysTiendas.todas(hogarId ?? ''),
    queryFn: async (): Promise<Tienda[]> => {
      const { data, error } = await supabase
        .from('tiendas')
        .select('*')
        .eq('hogar_id', hogarId as string)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Tienda[];
    },
    enabled: Boolean(hogarId),
  });
}

export type Sugerencia = { tienda_id: string; nombre: string } | null;

export function useSugerenciaTienda(
  hogarId: string | undefined,
  nombreProducto: string,
  tiendas: Tienda[] | undefined
) {
  const producto = normalizarProducto(nombreProducto);
  return useQuery({
    queryKey: keysTiendas.memoria(hogarId ?? '', producto),
    queryFn: async (): Promise<Sugerencia> => {
      const { data, error } = await supabase
        .from('producto_memoria')
        .select('tienda_id')
        .eq('hogar_id', hogarId as string)
        .eq('producto', producto)
        .maybeSingle();
      if (error) throw error;
      const memoria = data as Pick<MemoriaProducto, 'tienda_id'> | null;
      if (!memoria) return null;
      const tienda = (tiendas ?? []).find((t) => t.id === memoria.tienda_id);
      if (!tienda) return null;
      return { tienda_id: tienda.id, nombre: tienda.nombre };
    },
    enabled: Boolean(hogarId) && producto.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
