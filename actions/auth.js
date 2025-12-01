// /actions/auth.js
'use server'; 

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; 

// Exported Server Action for Sign In
export async function signIn(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const supabase = createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign In Error:', error.message);
    return redirect('/login?message=Invalid credentials or sign-in failed.');
  }

  return redirect('/dashboard');
};

// Exported Server Action for Sign Up
export async function signUp(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign Up Error:', error.message);
    return redirect('/login?message=Could not create user.');
  }
  
  return redirect('/login?message=Check your email to confirm your account.');
};