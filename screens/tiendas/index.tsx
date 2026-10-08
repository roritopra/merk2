import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Input, Label, TextField } from 'heroui-native';

import { Text, View } from '@/components/Themed';
import { useSession } from '@/lib/auth';
import { useHogar } from '@/features/listas/queries';
import { useTiendas } from '@/features/tiendas/queries';
import { useCreateTienda, useDeleteTienda } from '@/features/tiendas/mutations';

export function TiendasScreen() {
  const session = useSession();
  const userId = session.data?.user.id;
  const hogar = useHogar(userId);
  const tiendas = useTiendas(hogar.data?.id);
  const crear = useCreateTienda(hogar.data?.id, userId);
  const borrar = useDeleteTienda(hogar.data?.id);
  const [nombre, setNombre] = useState('');

  if (session.isPending || hogar.isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (session.isError || hogar.isError) {
    return (
      <View style={styles.center}>
        <Text>Error al cargar tu hogar.</Text>
        <Button variant="secondary" onPress={() => session.refetch()}>
          <Button.Label>Reintentar</Button.Label>
        </Button>
      </View>
    );
  }

  const guardar = () => {
    if (!nombre.trim() || crear.isPending) return;
    crear.mutate(nombre, { onSuccess: () => setNombre('') });
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Body>
          <Card.Title>Tus tiendas</Card.Title>
          <Card.Description>Se usan para agrupar cada lista.</Card.Description>
        </Card.Body>
        <Card.Footer style={styles.form}>
          <TextField>
            <Label>Nombre</Label>
            <Input
              placeholder="Ej: D1"
              value={nombre}
              onChangeText={setNombre}
              onSubmitEditing={guardar}
              returnKeyType="done"
            />
          </TextField>
          <Button variant="primary" onPress={guardar}>
            <Button.Label>Agregar tienda</Button.Label>
          </Button>
        </Card.Footer>
      </Card>
      {crear.isError && <Text style={styles.error}>No se pudo crear la tienda.</Text>}

      {tiendas.isPending ? (
        <ActivityIndicator style={styles.loader} />
      ) : tiendas.isError ? (
        <View style={styles.center}>
          <Text>No se pudieron cargar las tiendas.</Text>
          <Button variant="secondary" onPress={() => tiendas.refetch()}>
            <Button.Label>Reintentar</Button.Label>
          </Button>
        </View>
      ) : (
        <FlatList
          data={tiendas.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>Sin tiendas todavía. Agrega la primera arriba.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card variant="secondary">
              <Card.Body style={styles.row}>
                <Card.Title>{item.nombre}</Card.Title>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => borrar.mutate(item.id)}
                >
                  <Button.Label>Borrar</Button.Label>
                </Button>
              </Card.Body>
            </Card>
          )}
        />
      )}
    </View>
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
    gap: 8,
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
    justifyContent: 'space-between',
  },
  error: {
    color: '#b00020',
  },
});
