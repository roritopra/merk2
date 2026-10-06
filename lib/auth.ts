import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthError, Session } from '@supabase/supabase-js';

import { supabase } from './supabase';

export async function ensureSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function useSession() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['session'],
    queryFn: ensureSession,
    staleTime: Infinity,
    retry: 1,
  });

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      qc.invalidateQueries({ queryKey: ['session'] });
    });
    return () => listener.subscription.unsubscribe();
  }, [qc]);

  return query;
}

export type AuthResult =
  | { ok: true; needsConfirmation: boolean }
  | { ok: false; message: string };

function toMessage(error: AuthError): string {
  if (error.code === 'invalid_credentials') return 'Correo o contraseña incorrectos.';
  if (error.code === 'email_exists') return 'Ese correo ya tiene cuenta. Entra mejor.';
  if (error.code === 'weak_password') return 'Contraseña muy débil (mínimo 6 caracteres).';
  if (error.code === 'email_not_confirmed') return 'Confirma tu correo antes de entrar.';
  return error.message;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { ok: false, message: toMessage(error) };
  return { ok: true, needsConfirmation: false };
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { ok: false, message: toMessage(error) };
  return { ok: true, needsConfirmation: !data.session };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
