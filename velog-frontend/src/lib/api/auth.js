// @flow
import axios from 'lib/defaultClient';

export const sendAuthEmail = (email: string): Promise<*> =>
  axios.post('/auth/send-auth-email', { email });
export const getCode = (code: string): Promise<*> => axios.get(`/auth/code/${code}`);

type RegisterForm = {
  username: string,
  shortBio: string,
  displayName: string,
  fallbackEmail?: string,
};
export type LocalRegisterPayload = {
  registerToken: string,
  form: RegisterForm,
};

export const localRegister = ({ registerToken, form }: LocalRegisterPayload): Promise<*> =>
  axios.post('/auth/register/local', {
    registerToken,
    form,
  });

export const codeLogin = (code: string): Promise<*> => axios.post('/auth/code-login', { code });
export const check = (): Promise<*> => axios.get('/auth/check');
export const logout = (): Promise<*> => axios.post('/auth/logout');

export type VerifySocialPayload = { provider: string, accessToken: string };
export const verifySocial = ({ provider, accessToken }: VerifySocialPayload) =>
  axios.post(`/auth/verify-social/${provider}`, { accessToken });

export type SocialRegisterPayload = {
  provider: string,
  accessToken: string,
  form: RegisterForm,
};
export const socialRegister = ({ provider, accessToken, form }: SocialRegisterPayload) =>
  axios.post(`/auth/register/${provider}`, {
    accessToken,
    form,
  });

export type SocialLoginPayload = { provider: string, accessToken: string };
export const socialLogin = ({ provider, accessToken }: SocialLoginPayload) =>
  axios.post(`/auth/login/${provider}`, { accessToken });

export type GetProviderTokenPayload = { key: string, type: string };

export const getProviderToken = (payload: GetProviderTokenPayload) =>
  axios.get(`/auth/callback/token?key=${payload.key}`);

export const certifyEmail = (code: string) => axios.post(`/auth/certify?code=${code}`);
