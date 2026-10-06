export type Hogar = {
  id: string;
  nombre: string;
  created_by: string;
  created_at: string;
};

export type Lista = {
  id: string;
  hogar_id: string;
  nombre: string;
  estado: string;
  created_by: string;
  created_at: string;
};

export type Item = {
  id: string;
  lista_id: string;
  nombre: string;
  cantidad: string | null;
  unidad: string | null;
  tienda_id: string | null;
  comprado: boolean;
  comprado_por: string | null;
  comprado_at: string | null;
  created_at: string;
};
