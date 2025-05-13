export class AppRoutes {
  static home = '/';
  static login = '/login';
  static forgotPassword = '/forgot-password';
  static resetPassword = (token: string) =>
    `/change-password?token=${encodeURIComponent(token)}`;
  static account = `/account`;
  static subscribe = '/subscribe';
  static payment = '/payment';
  static paymentSuccess = `${this.payment}/success`;
  static paymentCancel = `${this.payment}/cancel`;
}
