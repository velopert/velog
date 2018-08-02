// @flow
import { Post } from 'pages';
import { actionCreators as postsActions } from 'store/modules/posts';
import { actionCreators as profileActions } from 'store/modules/profile';
import { actionCreators as listingActions } from 'store/modules/listing';
import { actionCreators as commonActions } from 'store/modules/common';
import { bindActionCreators } from 'redux';
import { type Match } from 'react-router';
import queryString from 'query-string';

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
    path: '/tags/:tag',
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
    preload: async (ctx: any, { dispatch }: any, match: Match) => {
      const { username } = match.params;
      const ProfileActions = bindActionCreators(profileActions, dispatch);
      const ListingActions = bindActionCreators(listingActions, dispatch);
      if (!username) return null;
      const promises = [
        ProfileActions.getProfile(username),
        ProfileActions.getUserTags(username),
        ListingActions.getUserPosts({ username }),
      ];
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
      if (!username || !tag) return null;
      await ProfileActions.getTagInfo(tag);
      const state = getState();
      const { rawTagName } = state.profile;
      console.log(rawTagName);
      const promises = [
        ProfileActions.getProfile(username),
        ProfileActions.getUserTags(username),
        ListingActions.getUserPosts({ username, tag: rawTagName }),
      ];
      return Promise.all(promises);
    },
    stop: true,
  },
  {
    path: '/@:username/:urlSlug',
    component: Post,
    preload: (ctx: any, { dispatch }: any, match: Match) => {
      const { username, urlSlug } = match.params;
      const PostsActions = bindActionCreators(postsActions, dispatch);
      if (!username || !urlSlug) return Promise.resolve();
      return PostsActions.readPost({
        username,
        urlSlug,
      });
    },
  },
];

export default routes;
