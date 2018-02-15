// @flow
import axios from 'axios';

export const listCategories = (): Promise<*> => axios.get('/me/categories');