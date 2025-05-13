'use server';

import { fetchApi, HTTPMethod } from '@/utils/fetch-api';
import { StripeRoutes } from './constants';
import Stripe from 'stripe';

export async function getStripeProducts() {
  return fetchApi<Stripe.Product[]>({
    method: HTTPMethod.GET,
    endpoint: StripeRoutes.products,
  });
}

export async function getStripePrices() {
  return fetchApi<Stripe.Price[]>({
    method: HTTPMethod.GET,
    endpoint: StripeRoutes.prices,
  });
}
