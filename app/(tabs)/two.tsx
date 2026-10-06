import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function HistorialTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      <Text>Aquí verás tus listas cerradas (Fase 4).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
