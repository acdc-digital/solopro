/**
 * PaymentService - Handles payment-related operations
 */

/**
 * Creates a checkout session with Stripe
 * @param priceId The Stripe Price ID
 * @param paymentMode The payment mode ('payment' for one-time, 'subscription' for recurring)
 * @param embeddedCheckout Whether to use embedded checkout (true) or redirect checkout (false)
 * @returns Object containing the checkout URL or client secret
 */
export async function createCheckoutSession(
  priceId: string, 
  paymentMode: 'payment' | 'subscription' = 'payment',
  embeddedCheckout: boolean = true
) {
  try {
    console.log(`Creating checkout session for price ID: ${priceId} with mode: ${paymentMode}, embedded: ${embeddedCheckout}`);
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, paymentMode, embeddedCheckout }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Checkout session creation failed:', data);
      throw new Error(data.error || 'Failed to create checkout session');
    }

    console.log('Checkout session created successfully');
    if (data.url) {
      console.log('Checkout URL provided:', data.url.substring(0, 50) + '...');
    } else if (data.clientSecret) {
      console.log('Client secret provided for embedded checkout');
    } else {
      console.warn('No checkout URL or client secret provided in response');
    }
    
    return data;
  } catch (error) {
    console.error('Payment service error:', error);
    throw error;
  }
}

/**
 * Retrieves a checkout session by ID
 * @param sessionId The Stripe Checkout Session ID
 * @returns The checkout session details
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    console.log(`Retrieving checkout session with ID: ${sessionId}`);
    
    const response = await fetch(`/api/get-checkout-session?session_id=${sessionId}`, {
      method: 'GET',
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Checkout session retrieval failed:', data);
      throw new Error(data.error || 'Failed to retrieve checkout session');
    }

    console.log('Checkout session retrieved successfully');
    return data;
  } catch (error) {
    console.error('Payment service error:', error);
    throw error;
  }
}

/**
 * Handles subscription status checking
 * @param sessionId The Stripe Checkout Session ID
 */
export async function checkSubscriptionStatus(sessionId: string) {
  try {
    console.log(`Checking subscription status for session ID: ${sessionId}`);
    
    const response = await fetch(`/api/check-subscription-status?session_id=${sessionId}`, {
      method: 'GET',
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Subscription status check failed:', data);
      throw new Error(data.error || 'Failed to check subscription status');
    }

    console.log('Subscription status retrieved successfully:', data.status);
    return data;
  } catch (error) {
    console.error('Payment service error:', error);
    throw error;
  }
} 