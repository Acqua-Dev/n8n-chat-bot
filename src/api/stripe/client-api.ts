import { StripeRoutes } from './constants';
import { fetchApi, HTTPMethod } from '@/utils/fetch-api';
import { CreateCheckoutSessionDto, CreateCustomerPortalDto } from './types';
import Stripe from 'stripe';
import { UrlResponse } from '@/api/common/types';

export async function createCheckoutSession(
  createCheckoutSessionDto: CreateCheckoutSessionDto,
) {
  return fetchApi<UrlResponse, CreateCheckoutSessionDto>({
    method: HTTPMethod.POST,
    endpoint: StripeRoutes.checkout,
    body: createCheckoutSessionDto,
  });
}

export async function getUserSubscriptions() {
  return fetchApi<Stripe.Subscription[]>({
    method: HTTPMethod.GET,
    endpoint: StripeRoutes.subscriptions,
  });
}

export async function createCustomerPortalSession(
  createCustomerPortalDto: CreateCustomerPortalDto,
): Promise<UrlResponse> {
  return fetchApi<UrlResponse, CreateCustomerPortalDto>({
    method: HTTPMethod.POST,
    endpoint: StripeRoutes.customerPortal,
    body: createCustomerPortalDto,
  });
}
