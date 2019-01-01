// @flow
import axios from 'lib/defaultClient';

export type CreateSeriesPayload = {
  name: string,
  description: string,
  url_slug: string,
  posts: any[],
  thumbnail: ?string,
};

export const createSeries = (payload: CreateSeriesPayload) => axios.post('/series', payload);

export const getSeriesList = (username: string) => axios.get(`/series/${username}`);
