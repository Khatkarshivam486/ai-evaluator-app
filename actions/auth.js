// /actions/auth.js
'use server'; // MUST be at the very top of this file

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; 

/**
 * Server Action to handle user sign-in.
 */
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
    // Redirect back with an error message
    return redirect('/login?message=Invalid credentials or sign-in failed.');
  }

  // Success: Redirect to the protected dashboard
  return redirect('/dashboard');
};

/**
 * Server Action to handle user sign-up.
 */
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
  
  // Success: User is created, confirmation email sent
  return redirect('/login?message=Check your email to confirm your account.');
};