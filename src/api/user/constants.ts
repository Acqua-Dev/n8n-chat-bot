export class UserRoutes {
  static base = '/user';
  static updateWithToken = (token: string) =>
    `${UserRoutes.base}/update-with-token/${token}`;
}
