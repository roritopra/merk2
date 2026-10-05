import * as React from 'react';

/**
 * Stub web para InputAccessoryView (API solo-iOS, react-native-web la deja
 * como UnimplementedView). Existe porque el webResolver de Uniwind redirige
 * el import interno de react-native-web hacia su wrapper, que re-importa el
 * índice de react-native-web a medio evaluar y rompe el bundle web
 * ("Cannot read properties of undefined (reading 'default')").
 * El require es perezoso (dentro del render) para evitar esa circularidad.
 */
export function InputAccessoryView(props) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return React.createElement(View, props);
}

export default InputAccessoryView;
