import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from 'heroui-native';

import { Text, View } from '@/components/Themed';
import { useSession } from '@/lib/auth';
import { useItems } from '@/features/listas/queries';
import { useAddItem, useCerrarLista, useToggleItem } from '@/features/listas/mutations';

export function ListaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const session = useSession();
  const userId = session.data?.user.id;
  const items = useItems(id);
  const agregar = useAddItem(id as string);
  const tachar = useToggleItem(id as string, userId);
  const cerrar = useCerrarLista(undefined);
  const [nombre, setNombre] = useState('');

  const guardar = () => {
    if (!nombre.trim() || agregar.isPending) return;
    agregar.mutate(nombre, { onSuccess: () => setNombre('') });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Lista' }} />
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Agregar producto"
            value={nombre}
            onChangeText={setNombre}
            onSubmitEditing={guardar}
            returnKeyType="done"
          />
          <Button variant="primary" onPress={guardar}>
            <Button.Label>Agregar</Button.Label>
          </Button>
        </View>
        {agregar.isError && <Text style={styles.error}>No se pudo agregar.</Text>}

        {items.isPending ? (
          <ActivityIndicator style={styles.loader} />
        ) : items.isError ? (
          <View style={styles.center}>
            <Text>No se pudieron cargar los productos.</Text>
            <Button variant="secondary" onPress={() => items.refetch()}>
              <Button.Label>Reintentar</Button.Label>
            </Button>
          </View>
        ) : (
          <FlatList
            data={items.data ?? []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text>Lista vacía. Agrega el primer producto.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                style={styles.row}
                onPress={() => tachar.mutate(item)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.comprado }}
                accessibilityLabel={item.nombre}
              >
                <Text style={styles.check}>{item.comprado ? '●' : '○'}</Text>
                <Text style={[styles.rowTitle, item.comprado && styles.tachado]}>
                  {item.nombre}
                </Text>
              </Pressable>
            )}
          />
        )}

        <Button
          variant="ghost"
          onPress={() =>
            cerrar.mutate(id as string, { onSuccess: () => router.back() })
          }
        >
          <Button.Label>Cerrar lista</Button.Label>
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  form: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  loader: {
    marginTop: 24,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 12,
    padding: 14,
  },
  check: {
    fontSize: 20,
  },
  rowTitle: {
    fontSize: 17,
  },
  tachado: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  error: {
    color: '#b00020',
  },
});
