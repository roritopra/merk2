import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SectionList, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Card, Input, Label, Select, TextField } from 'heroui-native';

import { Text, View } from '@/components/Themed';
import { useSession } from '@/lib/auth';
import { useHogar, useItems } from '@/features/listas/queries';
import { useAddItem, useAssignTienda, useCerrarLista, useToggleItem } from '@/features/listas/mutations';
import { useSugerenciaTienda, useTiendas } from '@/features/tiendas/queries';
import type { Item } from '@/features/listas/schema';

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

type Seccion = {
  titulo: string;
  tiendaId: string | null;
  data: Item[];
  pendientes: number;
};

const SIN_TIENDA = '__none';

export function ListaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const session = useSession();
  const userId = session.data?.user.id;
  const hogar = useHogar(userId);
  const hogarId = hogar.data?.id;
  const items = useItems(id);
  const tiendas = useTiendas(hogarId);
  const agregar = useAddItem(id as string, hogarId);
  const tachar = useToggleItem(id as string, userId);
  const asignar = useAssignTienda(id as string, hogarId);
  const cerrar = useCerrarLista(hogarId);

  const [nombre, setNombre] = useState('');
  const [tiendaManual, setTiendaManual] = useState<string | null | undefined>(undefined);
  const nombreDeb = useDebouncedValue(nombre, 300);
  const sugerencia = useSugerenciaTienda(hogarId, nombreDeb, tiendas.data);
  const tiendaEfectiva =
    tiendaManual !== undefined ? tiendaManual : (sugerencia.data?.tienda_id ?? null);

  const secciones = useMemo<Seccion[]>(() => {
    const grupos = new Map<string | null, Item[]>();
    for (const it of items.data ?? []) {
      const grupo = grupos.get(it.tienda_id) ?? [];
      grupo.push(it);
      grupos.set(it.tienda_id, grupo);
    }
    const secs: Seccion[] = [];
    for (const t of tiendas.data ?? []) {
      const data = grupos.get(t.id) ?? [];
      if (data.length === 0) continue;
      secs.push({
        titulo: t.nombre,
        tiendaId: t.id,
        data,
        pendientes: data.filter((it) => !it.comprado).length,
      });
    }
    const sin = grupos.get(null) ?? [];
    if (sin.length > 0) {
      secs.push({
        titulo: 'Sin tienda',
        tiendaId: null,
        data: sin,
        pendientes: sin.filter((it) => !it.comprado).length,
      });
    }
    return secs;
  }, [items.data, tiendas.data]);

  const guardar = () => {
    if (!nombre.trim() || agregar.isPending) return;
    agregar.mutate(
      { nombre, tiendaId: tiendaEfectiva },
      {
        onSuccess: () => {
          setNombre('');
          setTiendaManual(undefined);
        },
      }
    );
  };

  const opcionTienda = (tiendaId: string | null) => {
    if (!tiendaId) return undefined;
    const t = (tiendas.data ?? []).find((x) => x.id === tiendaId);
    return t ? { value: t.id, label: t.nombre } : undefined;
  };

  if (items.isPending || tiendas.isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (items.isError || tiendas.isError) {
    return (
      <View style={styles.center}>
        <Text>No se pudieron cargar los productos.</Text>
        <Button variant="secondary" onPress={() => items.refetch()}>
          <Button.Label>Reintentar</Button.Label>
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Lista' }} />
      <SectionList
        sections={secciones}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Card>
            <Card.Body>
              <Card.Title>Agregar producto</Card.Title>
              {tiendaEfectiva && sugerencia.data && tiendaManual === undefined && (
                <Button variant="ghost" size="sm" onPress={() => setTiendaManual(null)}>
                  <Button.Label>Sugerida: {sugerencia.data.nombre} ✓ (tocar para quitar)</Button.Label>
                </Button>
              )}
            </Card.Body>
            <Card.Footer style={styles.form}>
              <TextField>
                <Label>Producto</Label>
                <Input
                  placeholder="Ej: Plátano"
                  value={nombre}
                  onChangeText={(texto) => {
                    setNombre(texto);
                    setTiendaManual(undefined);
                  }}
                  onSubmitEditing={guardar}
                  returnKeyType="done"
                />
              </TextField>
              <Button variant="primary" onPress={guardar}>
                <Button.Label>Agregar{tiendaEfectiva ? ` en ${opcionTienda(tiendaEfectiva)?.label ?? ''}` : ''}</Button.Label>
              </Button>
              {agregar.isError && <Text style={styles.error}>No se pudo agregar.</Text>}
            </Card.Footer>
          </Card>
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Lista vacía. Agrega el primer producto.</Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{section.titulo}</Text>
            <Text style={styles.headerSub}>
              {section.pendientes > 0 ? `Te faltan ${section.pendientes}` : 'Al día'}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              style={styles.toggle}
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
            <Select
              value={opcionTienda(item.tienda_id)}
              onValueChange={(opt) => {
                const v = Array.isArray(opt) ? opt[0] : opt;
                asignar.mutate({
                  item,
                  tiendaId: v.value === SIN_TIENDA ? null : v.value,
                });
              }}
            >
              <Select.Trigger>
                <Select.Value placeholder="Tienda" />
                <Select.TriggerIndicator />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content presentation="bottom-sheet" snapPoints={['40%']}>
                  <Select.ListLabel>Tienda</Select.ListLabel>
                  <Select.Item value={SIN_TIENDA} label="Sin tienda" />
                  {(tiendas.data ?? []).map((t) => (
                    <Select.Item key={t.id} value={t.id} label={t.nombre} />
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>
          </View>
        )}
        ListFooterComponent={
          <Button variant="ghost" onPress={() => cerrar.mutate(id as string, { onSuccess: () => router.back() })}>
            <Button.Label>Cerrar lista</Button.Label>
          </Button>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  form: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 13,
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 12,
    padding: 12,
  },
  toggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
