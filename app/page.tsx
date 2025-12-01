import { redirect } from 'next/navigation';

/**
 * This component runs on the server and immediately redirects the user
 * from the root URL (/) to the login page.
 */
export default function Home() {
  redirect('/login');
}