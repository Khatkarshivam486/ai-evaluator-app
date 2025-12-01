// /components/UnlockReportButton.jsx
'use client';

import { useTransition } from 'react';
import { createCheckoutSession } from '@/actions/payment';

export default function UnlockReportButton({ taskId }) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        // Use useTransition to handle the pending state for the Server Action
        startTransition(async () => {
            await createCheckoutSession(taskId);
        });
    };

    return (
        <button 
            onClick={handleClick}
            disabled={isPending}
            style={{ 
                padding: '8px 15px', 
                background: isPending ? 'grey' : 'gold', 
                border: 'none', 
                cursor: 'pointer', 
                marginTop: '10px', 
                fontWeight: 'bold' 
            }}
        >
            {isPending ? 'Redirecting to Payment...' : 'Pay to Unlock Full Report'}
        </button>
    );
}