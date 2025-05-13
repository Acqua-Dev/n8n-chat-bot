export class AuthRoutes {
  static base = '/auth';
  static signUp = `${AuthRoutes.base}/sign-up`;
  static signIn = `${AuthRoutes.base}/sign-in`;
  static user = `${AuthRoutes.base}/user`;
  static forgotPassword = `${AuthRoutes.base}/forgot-password`;
}

export class AuthQueryKeys {
  static base = 'auth';
  static user = [this.base, 'user'];
}
export const JwtConstants = {
  accessToken: 'AUTH_JWT_ACCESS_TOKEN',
};
