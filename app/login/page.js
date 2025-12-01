// /app/login/page.js
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server'; // Import the secure Server Client

export default function LoginPage({ searchParams }) {
  // --- SERVER ACTION: SIGN IN ---
  const signIn = async (formData) => {
    'use server'; // This makes the function run securely on the server

    const email = formData.get('email');
    const password = formData.get('password');
    const supabase = createClient(); // Initialize server client
    
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
  const signUp = async (formData) => {
    'use server';
    
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

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h1>Sign In / Sign Up</h1>
      {/* Display messages like errors or confirmation texts */}
      {searchParams?.message && <p style={{ color: searchParams.message.includes('confirm') ? 'green' : 'red' }}>{searchParams.message}</p>}
      
      {/* Sign In Form: Uses the signIn Server Action */}
      <form action={signIn} style={{ marginBottom: '30px' }}>
        <h2>Sign In</h2>
        <input name="email" type="email" placeholder="Email" required style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }} />
        <input name="password" type="password" placeholder="Password" required style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }} />
        <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>

      {/* Sign Up Form: Uses the signUp Server Action */}
      <form action={signUp}>
        <h2>Sign Up</h2>
        <input name="email" type="email" placeholder="Email" required style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }} />
        <input name="password" type="password" placeholder="Password (min 6 characters)" required style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }} />
        <button type="submit" style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}