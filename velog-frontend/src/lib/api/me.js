// @flow
import axios from 'axios';

export const listCategories = (): Promise<*> => axios.get('/me/categories');
export const createCategory = ({ name }: { name: string }): Promise<*> => axios.post('/me/categories', {
  name,
});