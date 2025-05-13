export interface SignUpDto {
  activationCode?: string;
  email: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}
