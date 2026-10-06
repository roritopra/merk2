export const keys = {
  all: ['listas'] as const,
  hogar: (userId: string) => [...keys.all, 'hogar', userId] as const,
  listas: (hogarId: string) => [...keys.all, 'todas', hogarId] as const,
  items: (listaId: string) => [...keys.all, 'items', listaId] as const,
};
