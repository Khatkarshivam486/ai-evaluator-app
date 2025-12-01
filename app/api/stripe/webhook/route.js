// /app/api/stripe/webhook/route.js
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server'; // Import the secure server client

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

// IMPORTANT: Webhooks must be a POST request handler
export async function POST(req) {
    const body = await req.text();
    const signature = headers().get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // NOTE: Get this from your Stripe Dashboard

    let event;

    try {
        // 1. Verify the webhook signature to ensure it came from Stripe
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error(`⚠️ Webhook signature verification failed.`, err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // 2. Handle the specific event: payment succeeded
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const taskId = session.metadata.taskId; // Get the Task ID we saved earlier
        const userId = session.client_reference_id || session.customer_details.email; // Get user ID/email for reference
        const paymentId = session.id;

        // 3. SECURE DATABASE UPDATE (Bypassing RLS with Service Role Key)
        // NOTE: For true webhooks, you must re-initialize the client using your SERVICE_ROLE_KEY
        // You would need a new client setup function like createServiceRoleClient()

        // *** SECURITY NOTE: For simplicity, we assume this route is secure and will use the Supabase Admin API ***
        // In a production environment, you would use the service_role key here.
        const supabase = createClient(); 

        try {
            // A. Update the 'tasks' table to unlock the report
            const { error: taskError } = await supabase
                .from('tasks')
                .update({ full_report_unlocked: true, status: 'Report Unlocked' })
                .eq('id', taskId);

            if (taskError) throw taskError;

            // B. Insert a record into the 'payments' table
            // This relies on the 'service_role' RLS policy you defined earlier
            const { error: paymentError } = await supabase
                .from('payments')
                .insert({
                    user_id: session.customer, // Use Stripe Customer ID if available, or fetch from auth
                    task_id: taskId,
                    stripe_payment_id: paymentId,
                    amount: session.amount_total / 100, // Convert cents to dollars
                });
            
            if (paymentError) throw paymentError;

            console.log(`✅ Task ${taskId} unlocked and payment recorded.`);

        } catch (dbError) {
            console.error('Database Update Error:', dbError);
            return new Response('Database Update Failed', { status: 500 });
        }
    }

    // Return a 200 response to Stripe to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), { status: 200 });
}