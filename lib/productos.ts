export function normalizarProducto(nombre: string): string {
  return nombre.trim().toLowerCase().replace(/\s+/g, ' ');
}
