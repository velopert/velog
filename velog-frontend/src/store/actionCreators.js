// @flow
import { bindActionCreators } from 'redux';
import store from './index';
import { actionCreators as authActions, type AuthActionCreators } from './modules/auth';
import { actionCreators as userActions, type UserActionCreators } from './modules/user';
import { actionCreators as baseActions, type BaseActionCreators } from './modules/base';
import { actionCreators as writeActions, type WriteActionCreators } from './modules/write';
import { actionCreators as sampleActions, type SampleActionCreators } from './modules/sample';
import { actionCreators as postsActions, type PostsActionCreators } from './modules/posts';
import { actionCreators as listingActions, type ListingActionCreators } from './modules/listing';
import { actionCreators as profileActions } from './modules/profile';
import { actionCreators as followActions } from './modules/follow';
import { actionCreators as commonActions } from './modules/common';
import { actionCreators as settingsActions } from './modules/settings';
import { actionCreators as searchActions } from './modules/search';
import { actionCreators as seriesActions } from './modules/series';

const { dispatch } = store;

export const AuthActions: AuthActionCreators = bindActionCreators(authActions, dispatch);
export const UserActions: UserActionCreators = bindActionCreators(userActions, dispatch);
export const BaseActions: BaseActionCreators = bindActionCreators(baseActions, dispatch);
export const WriteActions: WriteActionCreators = bindActionCreators(writeActions, dispatch);
export const SampleActions: SampleActionCreators = bindActionCreators(sampleActions, dispatch);
export const PostsActions: PostsActionCreators = bindActionCreators(postsActions, dispatch);
export const ListingActions: ListingActionCreators = bindActionCreators(listingActions, dispatch);
export const ProfileActions: typeof profileActions = bindActionCreators(profileActions, dispatch);
export const FollowActions: typeof followActions = bindActionCreators(followActions, dispatch);
export const CommonActions: typeof commonActions = bindActionCreators(commonActions, dispatch);
export const SettingsActions: typeof settingsActions = bindActionCreators(
  settingsActions,
  dispatch,
);
export const SearchActions: typeof searchActions = bindActionCreators(searchActions, dispatch);
export const SeriesActions: typeof seriesActions = bindActionCreators(seriesActions, dispatch);
