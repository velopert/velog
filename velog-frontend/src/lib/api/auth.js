// @flow
import axios from 'axios';

export const sendVerificationEmail = (email: string): Promise<*> => axios.post('/auth/verify-email', { email });
