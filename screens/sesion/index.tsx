import { useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Button, Card, FieldError, Input, Label, TextField } from 'heroui-native';

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
          <TextField isRequired>
            <Label>Correo</Label>
            <Input
              placeholder="tucorreo@ejemplo.com"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </TextField>
          <TextField isRequired>
            <Label>Contraseña</Label>
            <Input
              placeholder="Mínimo 6 caracteres"
              value={clave}
              onChangeText={setClave}
              secureTextEntry
              onSubmitEditing={enviar}
              returnKeyType="done"
            />
          </TextField>
          {error && <FieldError>{error}</FieldError>}
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
  aviso: {
    color: '#0a7ea4',
  },
});
