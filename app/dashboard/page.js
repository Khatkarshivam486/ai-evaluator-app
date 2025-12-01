// /app/dashboard/page.js
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // Secure Server Client
import { cookies } from 'next/headers';
import LogoutButton from '@/components/LogoutButton'; 
import TaskSubmissionForm from '@/components/TaskSubmissionForm'; // REQUIRED COMPONENT
import UnlockReportButton from '@/components/UnlockReportButton'; // REQUIRED COMPONENT

export default async function DashboardPage() {
  // Initialize the server client using cookies for session check
  const supabase = createClient(cookies());

  // --- SECURITY CHECK (Server-Side) ---
  const {
    data: { user },
  } = await supabase.auth.getUser(); // Checks the session token securely from cookies

  if (!user) {
    // If no user session is found, redirect them to the login page
    return redirect('/login'); 
  }

  // --- FETCH USER'S TASKS ---
  // RLS ensures this query only returns tasks belonging to the logged-in user (user.id)
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*') 
    .order('created_at', { ascending: false }); 
  
  if (tasksError) {
      console.error('Failed to fetch tasks:', tasksError);
      // Handle the error gracefully
  }

  // --- PROTECTED CONTENT ---
  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h1>Smart Task Evaluator Dashboard</h1>
      <p>Welcome back, **{user.email}**!</p>
      
      <div style={{ marginTop: '20px', padding: '20px 0' }}>
          {/* 1. TASK SUBMISSION FORM */}
          <TaskSubmissionForm userId={user.id} />
      </div>

      <hr style={{ margin: '30px 0' }} />

      {/* 2. PAST REPORTS LIST */}
      <h2 style={{ marginBottom: '20px' }}>Your Past Evaluation Reports ({tasks.length})</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {tasks.map((task) => (
          <div key={task.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '5px', background: '#f9f9f9' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{task.task_title}</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>
              Status: **{task.status}** | Score: **{task.ai_score}/10**
            </p>
            
            {/* Display a partial report/teaser */}
            <p><strong>Strengths:</strong> {task.strengths.substring(0, 50)}...</p>

            {/* Display full report if unlocked, otherwise show payment button */}
            {task.full_report_unlocked ? (
                <>
                    <p style={{ color: 'green', fontWeight: 'bold' }}>Full Report Unlocked! 🎉</p>
                    <div style={{ whiteSpace: 'pre-wrap', border: '1px dashed grey', padding: '10px', marginTop: '10px' }}>
                        **Full Report:** {task.full_report}
                    </div>
                </>
            ) : (
                <UnlockReportButton taskId={task.id} />
            )}
            
          </div>
        ))}
        {tasks.length === 0 && <p>No tasks submitted yet.</p>}
      </div>

      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <LogoutButton />
      </div>
    </div>
  );
}