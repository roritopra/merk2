import { Stack } from 'expo-router';
import { Text, View } from '@/components/Themed';

/**
 * Fallback web: HeroUI Native es solo móvil (iOS/Android).
 * Esta variante evita importar heroui-native en web.
 */
export default function HeroUITestWebScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Prueba HeroUI' }} />
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          Prueba disponible solo en móvil
        </Text>
        <Text style={{ marginTop: 8, textAlign: 'center' }}>
          HeroUI Native no soporta web. Corre la app en Expo Go (Android/iOS) y
          abre esta misma ruta para ver el Button + Card.
        </Text>
      </View>
    </>
  );
}
