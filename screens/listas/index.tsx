import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { Button, Card } from 'heroui-native';

import { Text, View } from '@/components/Themed';
import { signOut, useSession } from '@/lib/auth';
import { useHogar, useListas } from '@/features/listas/queries';
import { useCreateLista } from '@/features/listas/mutations';

export function ListasScreen() {
  const session = useSession();
  const userId = session.data?.user.id;
  const hogar = useHogar(userId);
  const listas = useListas(hogar.data?.id);
  const crear = useCreateLista(hogar.data?.id, userId);
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
          <Card.Title>{hogar.data?.nombre ?? 'Mis listas'}</Card.Title>
          <Card.Description>Crear una lista nueva</Card.Description>
        </Card.Body>
        <Card.Footer style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Ej: Mercado semanal"
            value={nombre}
            onChangeText={setNombre}
            onSubmitEditing={guardar}
            returnKeyType="done"
          />
          <Button variant="primary" onPress={guardar}>
            <Button.Label>Crear</Button.Label>
          </Button>
        </Card.Footer>
      </Card>
      {crear.isError && <Text style={styles.error}>No se pudo crear la lista.</Text>}
      <Button variant="ghost" onPress={() => signOut()}>
        <Button.Label>Cerrar sesión</Button.Label>
      </Button>

      {listas.isPending ? (
        <ActivityIndicator style={styles.loader} />
      ) : listas.isError ? (
        <View style={styles.center}>
          <Text>No se pudieron cargar las listas.</Text>
          <Button variant="secondary" onPress={() => listas.refetch()}>
            <Button.Label>Reintentar</Button.Label>
          </Button>
        </View>
      ) : (
        <FlatList
          data={listas.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No hay listas todavía. Crea la primera arriba.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Link href={`/lista/${item.id}`} asChild>
              <Pressable style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{item.nombre}</Text>
                  <Text style={styles.rowSub}>
                    {item.estado === 'abierta' ? 'Abierta' : 'Cerrada'}
                  </Text>
                </View>
              </Pressable>
            </Link>
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
  input: {
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
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 12,
    padding: 14,
  },
  rowText: {
    gap: 2,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 13,
    opacity: 0.6,
  },
  error: {
    color: '#b00020',
  },
});
