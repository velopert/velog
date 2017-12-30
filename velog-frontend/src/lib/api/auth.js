// @flow
import axios from 'axios';

export const sendAuthEmail = (email: string): Promise<*> => axios.post('/auth/send-auth-email', { email });
export const getCode = (code: string): Promise<*> => axios.get(`/auth/code/${code}`);
