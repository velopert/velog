// @flow
import axios from 'axios';

export const sendAuthEmail = (email: string): Promise<*> => axios.post('/auth/send-auth-email', { email });
