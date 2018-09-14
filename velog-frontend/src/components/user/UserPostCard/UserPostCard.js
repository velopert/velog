// @flow
import React from 'react';
import type { PostItem } from 'store/modules/listing';
import './UserPostCard.scss';

type Props = {
  posts?: ?(PostItem[]),
};

const UserPostCard = (props: Props) => <div className="UserPostCard">UserPostCard</div>;

export default UserPostCard;
