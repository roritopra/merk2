export const keysTiendas = {
  all: ['tiendas'] as const,
  todas: (hogarId: string) => [...keysTiendas.all, 'todas', hogarId] as const,
  memoria: (hogarId: string, producto: string) =>
    [...keysTiendas.all, 'memoria', hogarId, producto] as const,
};
