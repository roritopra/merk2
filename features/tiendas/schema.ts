export type Tienda = {
  id: string;
  hogar_id: string;
  nombre: string;
  created_at: string;
};

export type MemoriaProducto = {
  hogar_id: string;
  producto: string;
  tienda_id: string;
  updated_at: string;
};
