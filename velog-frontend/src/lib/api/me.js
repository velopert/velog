// @flow
import axios from 'axios';

export const listCategories = (): Promise<*> => axios.get('/me/categories');
export const createCategory = (name: string): Promise<*> => axios.post('/me/categories', {
  name,
});
export const deleteCategory = (id: string): Promise<*> => axios.delete(`/me/categories/${id}`);