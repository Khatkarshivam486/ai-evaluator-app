// /components/LogoutButton.jsx
'use client'; // Marks this as a Client Component

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Import the Client Client

export default function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    const supabase = createClient();
    // Sign out the user
    await supabase.auth.signOut();
    // Force a full server re-render to check the new, non-existent session
    router.refresh(); 
  };

  return (
    <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
      Log Out
    </button>
  );
}