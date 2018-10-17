// @flow
import axios from 'lib/defaultClient';

export const listUserTags = (username: string) => axios.get(`/users/@${username}/tags`);
export const getProfile = (username: string) => axios.get(`/users/@${username}`);

type GetHistoryParams = {
  username: string,
  offset?: number,
};
export const getHistory = ({ username, offset }: GetHistoryParams) =>
  axios.get(`/users/@${username}/history?${offset ? `offset=${offset}` : ''}`);
