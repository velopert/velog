// @flow
import axios from 'axios';

export const sendAuthEmail = (email: string): Promise<*> => axios.post('/auth/send-auth-email', { email });
export const getCode = (code: string): Promise<*> => axios.get(`/auth/code/${code}`);

export type LocalRegisterPayload = {
  registerToken: string,
  form: {
    username: string,
    shortBio: string,
    displayName: string
  }
}

export const localRegister = ({
  registerToken,
  form,
}: LocalRegisterPayload): Promise<*> => axios.post('/auth/register/local', {
  registerToken,
  form,
});

export const codeLogin = (code: string): Promise<*> => axios.post('/auth/code-login', { code });
export const check = (): Promise<*> => axios.get('/auth/check');
