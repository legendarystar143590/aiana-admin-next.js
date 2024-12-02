import { useState } from 'react';

export default function StripePage() {
  const [sessionId, setSessionId] = useState(null);
  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const userEmail = localStorage.getItem('email');
  const handleSubscribe = async (priceId) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, customerEmail: userEmail }), // Send email if available
      });

      const data = await response.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
      } else {
        console.error('Error creating checkout session:', data.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div>
      {sessionId && (
        <script src="https://checkout.stripe.com/checkout.js" type="text/javascript">
          {`
            const stripe = Stripe(${stripePublishableKey}); // Replace with your publishable key
            stripe.redirectToCheckout({ sessionId: '${sessionId}' });
          `}
        </script>
      )}
    </div>
  );
}

export async function getServerSideProps() {
    // ... other code ...
}