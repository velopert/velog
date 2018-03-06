// @flow
import axios from 'axios';

export const listCategories = (): Promise<*> => axios.get('/me/categories');
export const createCategory = (name: string): Promise<*> => axios.post('/me/categories', {
  name,
});
export const deleteCategory = (id: string): Promise<*> => axios.delete(`/me/categories/${id}`);

export type UpdateCategoryPayload = {
  id: string,
  name: string,
};

export const updateCategory = ({ id, name }: UpdateCategoryPayload): Promise<*> => axios.patch(
  `/me/categories/${id}`,
  { name },
);