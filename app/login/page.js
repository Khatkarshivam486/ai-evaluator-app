// /app/login/page.js (UPDATED CODE)
import { redirect } from 'next/navigation';
// NOTE: Import the Server Actions from the new file
import { signIn, signUp } from '@/actions/auth'; 

export default function LoginPage({ searchParams }) {
  // signIn and signUp functions are REMOVED from here.
  
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h1>Sign In / Sign Up</h1>
      {/* Display messages like errors or confirmation texts */}
      {searchParams?.message && <p style={{ color: searchParams.message.includes('confirm') ? 'green' : 'red' }}>{searchParams.message}</p>}
      
      {/* Sign In Form: Uses the imported signIn Server Action */}
      <form action={signIn} style={{ marginBottom: '30px' }}>
        <h2>Sign In</h2>
        <input name="email" type="email" placeholder="Email" required style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }} />
        <input name="password" type="password" placeholder="Password" required style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }} />
        <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>

      {/* Sign Up Form: Uses the imported signUp Server Action */}
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