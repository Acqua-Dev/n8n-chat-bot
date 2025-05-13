export class StripeRoutes {
  static base = '/stripe';
  static products = `${StripeRoutes.base}/products`;
  static prices = `${StripeRoutes.base}/prices`;
  static checkout = `${StripeRoutes.base}/checkout`;
  static subscriptions = `${StripeRoutes.base}/subscriptions`;
  static customerPortal = `${StripeRoutes.base}/customer-portal`;
}

export class StripeQueryKeys {
  static base = 'stripe';
  static products = [this.base, 'products'];
  static prices = [this.base, 'prices'];
  static subscriptions = [this.base, 'subscriptions'];
}
