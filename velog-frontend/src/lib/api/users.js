// @flow
import axios from 'lib/defaultClient';

export const listUserTags = (username: string) => axios.get(`/users/@${username}/tags`);
export const getProfile = (username: string) => axios.get(`/users/@${username}`);
