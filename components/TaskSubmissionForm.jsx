// /components/TaskSubmissionForm.jsx
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createNewTask } from '@/actions/ai'; // Import the Server Action

export default function TaskSubmissionForm({ userId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Ensure the Server Action is called within startTransition
    startTransition(async () => {
        const result = await createNewTask(formData); // Call the Server Action
        if (result.success) {
            alert('Task submitted successfully! Evaluation is running...');
        } else {
            alert(result.message);
        }
        // Force the dashboard to re-fetch the task list, showing the new task
        router.refresh(); 
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Submit Your Code for Evaluation</h3>
      
      {/* Hidden field for secure User ID, passed from Server Component */}
      <input type="hidden" name="user_id" value={userId} />

      <input 
        name="task_title" 
        placeholder="Task Title (e.g., Next.js Data Fetching Function)" 
        required 
        style={{ padding: '10px', border: '1px solid #ddd' }}
      />
      
      <textarea
        name="task_description"
        placeholder="Briefly describe the goal of the task..."
        rows="3"
        required
        style={{ padding: '10px', border: '1px solid #ddd' }}
      />

      <textarea
        name="code_snippet"
        placeholder="Paste your code snippet here..."
        rows="10"
        required
        style={{ padding: '10px', fontFamily: 'monospace', border: '1px solid #ddd' }}
      />

      <button 
        type="submit" 
        disabled={isPending}
        style={{ padding: '12px 20px', background: isPending ? '#ccc' : 'darkblue', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        {isPending ? 'Submitting & Evaluating...' : 'Run Initial Evaluation'}
      </button>
    </form>
  );
}