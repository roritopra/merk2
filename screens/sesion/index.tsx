import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { Button, Card } from 'heroui-native';

import { Text, View } from '@/components/Themed';
import { signIn, signUp } from '@/lib/auth';

type Modo = 'entrar' | 'crear';

export function SesionScreen() {
  const [modo, setModo] = useState<Modo>('entrar');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const valido =
    correo.trim().includes('@') && correo.includes('.') && clave.length >= 6;

  const enviar = async () => {
    if (!valido || cargando) return;
    setCargando(true);
    setError(null);
    setAviso(null);
    const resultado =
      modo === 'entrar' ? await signIn(correo, clave) : await signUp(correo, clave);
    setCargando(false);
    if (!resultado.ok) {
      setError(resultado.message);
      return;
    }
    if (resultado.needsConfirmation) {
      setAviso('Cuenta creada. Revisa tu correo para confirmarla y luego entra.');
      setModo('entrar');
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Body>
          <Card.Title>{modo === 'entrar' ? 'Entrar' : 'Crear cuenta'}</Card.Title>
          <Card.Description>
            {modo === 'entrar'
              ? 'Entra con tu correo para ver tus listas.'
              : 'Crea tu cuenta para empezar tu hogar.'}
          </Card.Description>
        </Card.Body>
        <Card.Footer style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña (mínimo 6)"
            value={clave}
            onChangeText={setClave}
            secureTextEntry
            onSubmitEditing={enviar}
            returnKeyType="done"
          />
          {error && <Text style={styles.error}>{error}</Text>}
          {aviso && <Text style={styles.aviso}>{aviso}</Text>}
          <Button variant="primary" onPress={enviar}>
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Button.Label>{modo === 'entrar' ? 'Entrar' : 'Crear cuenta'}</Button.Label>
            )}
          </Button>
          <Button
            variant="ghost"
            onPress={() => {
              setModo(modo === 'entrar' ? 'crear' : 'entrar');
              setError(null);
              setAviso(null);
            }}
          >
            <Button.Label>
              {modo === 'entrar' ? '¿Sin cuenta? Crear una' : '¿Ya tienes cuenta? Entrar'}
            </Button.Label>
          </Button>
        </Card.Footer>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
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
  error: {
    color: '#b00020',
  },
  aviso: {
    color: '#0a7ea4',
  },
});
