'use server';

import { createClient } from '@/lib/supabase/server'; // Use the SERVER client here!

export const createNewTask = async (formData) => {
    'use server';

    const supabase = createClient(); 
    // ... (retrieve form data and insert into tasks table) ...

    // Insert data into the 'tasks' table
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        // ... (task object) ...
      ])
      .select();

    if (error) {
      // ... (error handling) ...
      return { success: false, message: 'Failed to submit task.' };
    }

    const taskId = data[0].id; // Get the ID of the new task

    // --- NEW: Trigger AI Evaluation ---
    // NOTE: In a real app, this should be done by a Supabase Edge Function/Webhook 
    // triggered by the task insert, but a direct server action call is simplest here.
    const aiResult = await runAIEvaluation(
        taskId, 
        task_title, 
        task_description, 
        code_snippet
    );

    if (!aiResult.success) {
        // Log the failure but still return success for the task submission itself
        console.warn(aiResult.message);
    }
    // ----------------------------------

    return { success: true, taskId: taskId };
  };