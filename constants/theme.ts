/**
 * Tokens compartidos de la app (colores puntuales, radios, espaciados).
 * Fuente única para los valores que antes estaban hardcodeados en cada
 * pantalla. Convive con `Colors.ts` (tint/text/background por esquema);
 * los componentes HeroUI traen su propio tema.
 */
export const theme = {
  colors: {
    /** Bordes de filas/tarjetas. */
    border: '#e2e2e2',
    /** Texto de error en formularios. */
    error: '#b00020',
    /** Texto de aviso informativo (ex: confirmación de correo). */
    info: '#0a7ea4',
    /** Enlaces (ex: pantalla 404). */
    link: '#2e78b7',
  },
  radius: {
    card: 12,
  },
  spacing: {
    sm: 8,
    md: 16,
  },
} as const;
