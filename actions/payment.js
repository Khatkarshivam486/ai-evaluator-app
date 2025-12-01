// /actions/payment.js
'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';

// Initialize Stripe with the secret key and API version
// NOTE: Ensure STRIPE_SECRET_KEY is set in Vercel Environment Variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Use a recent API version
});

/**
 * Creates a Stripe checkout session for a specific task.
 * @param {string} taskId - The ID of the task being paid for.
 */
export async function createCheckoutSession(taskId) {
    // 1. Define the item the user is paying for
    // 🛑 IMPORTANT: You MUST replace 'price_XXX' with a real Price ID from your Stripe Dashboard.
    const priceId = 'price_XXX'; 

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // 2. Pass task ID as metadata (crucial for the webhook)
            metadata: {
                taskId: taskId,
            },
            // 3. Define the success and cancel URLs
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success&task=${taskId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=cancelled`,
        });

        // 4. Redirect the user to the Stripe Checkout page
        if (session.url) {
            redirect(session.url);
        } else {
            throw new Error('Failed to create Stripe session URL.');
        }

    } catch (error) {
        console.error('Stripe Checkout Error:', error.message);
        // Redirect to a generic error page
        redirect('/dashboard?status=error&message=Payment processing failed.');
    }
}