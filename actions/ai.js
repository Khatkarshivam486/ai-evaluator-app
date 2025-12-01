// /actions/ai.js 
'use server';

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server'; // Secure Server Client

// Initialize Gemini client using the secure environment variable
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); 

/**
 * Calls the LLM to evaluate the task and updates the database.
 * @param {string} taskId - The ID of the task row to update.
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description provided by the user.
 * @param {string} codeSnippet - The actual code snippet.
 */
export async function runAIEvaluation(taskId, taskTitle, taskDescription, codeSnippet) {
    const supabase = createClient();
    
    // Define the AI Prompt (requesting strict JSON format)
    const prompt = `You are the Smart Task Evaluator AI. Analyze this code snippet based on the task description.
    TASK: ${taskTitle} / ${taskDescription}
    CODE: ${codeSnippet}
    
    Provide your evaluation in a strict JSON format (keys ONLY: "score", "strengths", "improvements", "full_report").`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const result = JSON.parse(response.text.trim());

        // Update the database with initial feedback and the full report
        const { error: updateError } = await supabase
            .from('tasks')
            .update({
                status: 'Evaluated',
                ai_score: result.score,
                strengths: result.strengths,
                improvements: result.improvements,
                full_report: result.full_report, // Saved for later unlock
            })
            .eq('id', taskId);

        if (updateError) throw updateError;
        return { success: true, message: 'AI evaluation complete and saved.' };

    } catch (e) {
        console.error('AI or DB Update Error:', e);
        await supabase.from('tasks').update({ status: 'Failed' }).eq('id', taskId);
        return { success: false, message: 'AI evaluation failed.' };
    }
}

/**
 * Server Action to handle form submission and trigger AI.
 */
export async function createNewTask(formData) {
    // This runs securely on the server
    const supabase = createClient(); 

    // Retrieve data from FormData object
    const user_id = formData.get('user_id'); 
    const task_title = formData.get('task_title');
    const task_description = formData.get('task_description');
    const code_snippet = formData.get('code_snippet');

    // 1. Insert initial task into the 'tasks' table
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id, task_title, task_description, code_snippet }])
      .select();

    if (error) {
      console.error('Task Submission Error:', error.message);
      return { success: false, message: 'Failed to submit task.' };
    }

    const taskId = data[0].id; // Get the ID of the new task

    // 2. Trigger the AI Evaluation
    const aiResult = await runAIEvaluation(
        taskId, 
        task_title, 
        task_description, 
        code_snippet
    );

    return { success: true, taskId: taskId, aiStatus: aiResult.success };
}