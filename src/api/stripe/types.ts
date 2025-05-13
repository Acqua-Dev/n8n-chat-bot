import Stripe from 'stripe';

export interface CreateCheckoutSessionDto {
  priceId: string;
  quantity?: number;
  mode: Stripe.Checkout.SessionCreateParams.Mode;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCustomerPortalDto {
  returnUrl: string;
}
