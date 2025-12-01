// /actions/auth.js
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // Secure Server Client

// --- SERVER ACTION: SIGN IN ---
export async function signIn(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const supabase = createClient();
    
    // Attempt to sign in
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

// --- SERVER ACTION: SIGN UP ---
export async function signUp(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const supabase = createClient();

    // Attempt to sign up
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Sign Up Error:', error.message);
      return redirect('/login?message=Could not create user.');
    }
    
    // Success: User is created, and your database trigger handles the 'profiles' row!
    return redirect('/login?message=Check your email to confirm your account.');
};