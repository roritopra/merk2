import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Button, Card } from 'heroui-native';

import { supabase } from '@/lib/supabase';

const isSupabaseConfigured = Boolean(
  process.env.EXPO_PUBLIC_SUPABASE_URL?.startsWith('http') &&
    !process.env.EXPO_PUBLIC_SUPABASE_URL.includes('tu-proyecto') &&
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('tu_key')
);

export default function HeroUITestScreen() {
  const [count, setCount] = useState(0);
  void supabase;

  return (
    <>
      <Stack.Screen options={{ title: 'Prueba HeroUI' }} />
      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card>
          <Card.Body>
            <Card.Title>Prueba HeroUI Native</Card.Title>
            <Card.Description>
              Card + Button renderizados con Uniwind. Contador: {count}
            </Card.Description>
          </Card.Body>
          <Card.Footer className="flex-row gap-3">
            <Button variant="primary" onPress={() => setCount((c) => c + 1)}>
              <Button.Label>Tocar ({count})</Button.Label>
            </Button>
            <Button variant="ghost" onPress={() => setCount(0)}>
              <Button.Label>Reiniciar</Button.Label>
            </Button>
          </Card.Footer>
        </Card>

        <Card variant="secondary">
          <Card.Body>
            <Card.Title>Supabase</Card.Title>
            <Card.Description>
              {isSupabaseConfigured
                ? 'Cliente configurado (.env.local con URL + publishable key).'
                : 'Pendiente: completa .env.local con URL + publishable key.'}
            </Card.Description>
          </Card.Body>
        </Card>

        <Button variant="secondary">
          <Button.Label>Secondary</Button.Label>
        </Button>
        <Button variant="outline">
          <Button.Label>Outline</Button.Label>
        </Button>
        <Button variant="danger">
          <Button.Label>Danger</Button.Label>
        </Button>
      </ScrollView>
    </>
  );
}
