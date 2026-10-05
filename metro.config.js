const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// Workaround web: el webResolver de Uniwind redirige el import interno
// './exports/InputAccessoryView' de react-native-web hacia su wrapper, que a
// su vez re-importa el índice de react-native-web a medio evaluar y rompe el
// bundle web con "Cannot read properties of undefined (reading 'default')".
// Se intercepta ese módulo y se sirve un stub local con require perezoso.
// (Patrón de resolveRequest personalizado documentado por Uniwind.)
const prevResolveRequest = config.resolver?.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const origin = context.originModulePath || '';
  const normalized = moduleName.replace(/\\/g, '/');
  const isRNWebOrigin = origin.includes(`${path.sep}react-native-web${path.sep}`);
  if (
    platform === 'web' &&
    isRNWebOrigin &&
    /(^|\/)exports\/InputAccessoryView(\.(js|jsx|ts|tsx))?$/.test(normalized)
  ) {
    return {
      filePath: path.join(__dirname, 'web-stubs', 'InputAccessoryView.js'),
      type: 'sourceFile',
    };
  }
  const fallback = prevResolveRequest ?? context.resolveRequest;
  return fallback(context, moduleName, platform);
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
});
