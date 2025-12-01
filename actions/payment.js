// /actions/payment.js
'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';

// Initialize Stripe with the secret key and API version
// process.env.STRIPE_SECRET_KEY must be set in Vercel Environment Variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Use a recent API version
});

/**
 * Creates a Stripe checkout session for a specific task.
 * @param {string} taskId - The ID of the task being paid for.
 */
export async function createCheckoutSession(taskId) {
    // 1. Define the item the user is paying for
    const priceId = 'price_1SZXfZHOtRvVzFX5sBLp7aKY'; // ⚠️ IMPORTANT: REPLACE THIS with your real Stripe Price ID (e.g., price_1Nf8g2D...)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ai-evaluator-app.vercel.app'; 

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            // Use the taskId in the metadata to update the correct task on successful payment
            metadata: {
                task_id: taskId,
            },
            // Success and Cancel URLs
            success_url: `${appUrl}/dashboard/task/${taskId}?success=true`,
            cancel_url: `${appUrl}/dashboard/task/${taskId}?success=false`,
        });

        // 2. Redirect the user to the Stripe Checkout page
        return redirect(session.url);

    } catch (e) {
        console.error('Stripe Checkout Error:', e);
        return { success: false, message: 'Failed to create checkout session.' };
    }
}