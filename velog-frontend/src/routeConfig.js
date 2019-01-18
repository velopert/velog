// @flow
import { Post } from 'pages';
import { actionCreators as postsActions } from 'store/modules/posts';
import { actionCreators as profileActions } from 'store/modules/profile';
import { actionCreators as listingActions } from 'store/modules/listing';
import { actionCreators as commonActions } from 'store/modules/common';
import { actionCreators as followActions } from 'store/modules/follow';
import { actionCreators as seriesActions } from 'store/modules/series';

import { bindActionCreators } from 'redux';
import type { State } from 'store';
import { type Match } from 'react-router';
import queryString from 'query-string';

const tagsFetcher = async (ctx: any, { dispatch, getState }: any, match: Match) => {
  const { tag } = match.params;
  const { sort } = ctx.query;
  const CommonActions = bindActionCreators(commonActions, dispatch);
  const promises = [CommonActions.getTags(sort)];
  if (tag) {
    await CommonActions.getTagInfo(tag);
    const ListingActions = bindActionCreators(listingActions, dispatch);
    const state = getState();
    const tagName = state.common.tags.selected.name;
    promises.push(ListingActions.getTagPosts({ tag: tagName }));
  }
  return Promise.all(promises);
};

const routes = [
  {
    path: '/recent',
    preload: async (ctx: any, { dispatch }: any, match: Match) => {
      const ListingActions = bindActionCreators(listingActions, dispatch);
      return ListingActions.getRecentPosts();
    },
  },
  {
    path: '/trending',
    preload: async (ctx: any, { dispatch }: any, match: Match) => {
      const ListingActions = bindActionCreators(listingActions, dispatch);
      return ListingActions.getTrendingPosts();
    },
  },
  {
    path: '/tags/:tag?',
    preload: async (ctx: any, { dispatch, getState }: any, match: Match) => {
      const { tag } = match.params;
      const { sort } = ctx.query;
      const CommonActions = bindActionCreators(commonActions, dispatch);
      const promises = [CommonActions.getTags(sort)];
      if (tag) {
        await CommonActions.getTagInfo(tag);
        const ListingActions = bindActionCreators(listingActions, dispatch);
        const state = getState();
        const tagName = state.common.tags.selected.name;
        promises.push(ListingActions.getTagPosts({ tag: tagName }));
      }
      return Promise.all(promises);
    },
  },
  {
    path: '/@:username',
    exact: true,
    preload: async (ctx: any, { getState, dispatch }: any, match: Match) => {
      const { username } = match.params;
      const ProfileActions = bindActionCreators(profileActions, dispatch);
      const ListingActions = bindActionCreators(listingActions, dispatch);
      const FollowActions = bindActionCreators(followActions, dispatch);

      if (!username) return null;
      await ProfileActions.getProfile(username);
      const state: State = getState();
      const { profile } = state.profile;

      if (!username) return Promise.resolve(null);
      const promises = [
        ProfileActions.getUserTags(username),
        ListingActions.getUserPosts({ username }),
      ];
      if (profile && ctx.state.logged) {
        promises.push(FollowActions.getUserFollow(profile.id));
      }
      return Promise.all(promises);
    },
  },
  {
    path: '/@:username/tags/:tag',
    exact: true,
    preload: async (ctx: any, { dispatch, getState }: any, match: Match) => {
      const { username, tag } = match.params;
      const ProfileActions = bindActionCreators(profileActions, dispatch);
      const ListingActions = bindActionCreators(listingActions, dispatch);
      const FollowActions = bindActionCreators(followActions, dispatch);
      if (!username || !tag) return null;
      await ProfileActions.getProfile(username);
      await ProfileActions.getTagInfo(tag);
      const state: State = getState();
      const { rawTagName, profile } = state.profile;
      const promises = [
        ProfileActions.getUserTags(username),
        ListingActions.getUserPosts({ username, tag: rawTagName || '' }),
      ];
      if (profile) {
        if (ctx.state.logged) {
          promises.push(FollowActions.getUserFollow(profile.id));
        }
      }
      return Promise.all(promises);
    },
    stop: true,
  },
  {
    path: '/@:username/history',
    exact: true,
    preload: async (ctx: any, { dispatch, getState }: any, match: Match) => {
      const { username } = match.params;
      const ProfileActions = bindActionCreators(profileActions, dispatch);
      const FollowActions = bindActionCreators(followActions, dispatch);
      if (!username) return null;
      ProfileActions.setSideVisibility(false);
      await ProfileActions.getProfile(username);
      const state: State = getState();
      const { profile } = state.profile;
      const promises = [
        ProfileActions.getUserTags(username),
        ProfileActions.getUserHistory({ username }),
      ];
      if (profile) {
        if (ctx.state.logged) {
          promises.push(FollowActions.getUserFollow(profile.id));
        }
      }
      return Promise.all(promises);
    },
    stop: true,
  },
  {
    path: '/@:username/about',
    exact: true,
    preload: async (ctx: any, { dispatch, getState }: any, match: Match) => {
      const { username } = match.params;
      const ProfileActions = bindActionCreators(profileActions, dispatch);
      const FollowActions = bindActionCreators(followActions, dispatch);
      if (!username) return null;
      ProfileActions.setSideVisibility(false);
      await ProfileActions.getProfile(username);
      const state: State = getState();
      const { profile } = state.profile;
      if (profile) {
        if (ctx.state.logged) {
          await FollowActions.getUserFollow(profile.id);
        }
      }
      return Promise.resolve();
    },
    stop: true,
  },
  {
    path: '/@:username/series/:urlSlug',
    preload: async (ctx: any, { dispatch, getState }: any, match: Match) => {
      const SeriesActions = bindActionCreators(seriesActions, dispatch);
      const { username, urlSlug } = match.params;
      if (!username || !urlSlug) return null;
      return SeriesActions.getSeries({
        username,
        urlSlug,
      });
    },
    stop: true,
  },
  {
    path: '/@:username/series',
    exact: true,
    preload: async (ctx: any, { dispatch, getState }: any, match: Match) => {
      const { username } = match.params;
      const ProfileActions = bindActionCreators(profileActions, dispatch);
      const FollowActions = bindActionCreators(followActions, dispatch);
      if (!username) return null;
      ProfileActions.setSideVisibility(false);
      await Promise.all([
        ProfileActions.getProfile(username),
        ProfileActions.getSeriesList(username),
      ]);
      const state: State = getState();
      const { profile } = state.profile;
      if (profile) {
        if (ctx.state.logged) {
          await FollowActions.getUserFollow(profile.id);
        }
      }
      return Promise.resolve();
    },
    stop: true,
  },
  {
    path: '/@:username/:urlSlug',
    component: Post,
    preload: async (ctx: any, { dispatch, getState }: any, match: Match) => {
      const { username, urlSlug } = match.params;
      const PostsActions = bindActionCreators(postsActions, dispatch);
      if (!username || !urlSlug) return Promise.resolve();
      await PostsActions.readPost({
        username,
        urlSlug,
      });
      const { posts } = getState();
      if (!posts.post) return null;
      const postId = posts.post.id;
      await Promise.all([PostsActions.readComments({ postId }), PostsActions.getSequences(postId)]);
      return null;
    },
  },
];

export default routes;
