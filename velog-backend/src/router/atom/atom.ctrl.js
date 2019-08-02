// @flow
import Post from 'database/models/Post';
import User from 'database/models/User';
import UserProfile from 'database/models/UserProfile';

import { Feed } from 'feed';
import { formatShortDescriptionForAtom } from 'lib/common';

import type { Middleware } from 'koa';

const convertToFeed = (post) => {
  const { username } = post.user;
  const link = `https://velog.io/@${username}/${encodeURI(post.url_slug)}`;
  return {
    link,
    title: post.title,
    description: formatShortDescriptionForAtom(post.body),
    id: link,
    image: post.thumbnail,
    date: post.released_at,
    author: [
      {
        name: post.user.user_profile.display_name,
        link: `https://velog.io/@${username}`,
      },
    ],
  };
};

export const getEntireRSS: Middleware = async (ctx) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          include: [UserProfile],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 20,
      where: {
        is_temp: false,
        is_private: false,
      },
    });
    const feed = new Feed({
      title: 'velog',
      description:
        '개발자들을 위한 취향저격 블로그 서비스. 어디서 글 쓸지 고민하지 말고 벨로그에서 시작하세요.',
      link: 'https://velog.io/',
      id: 'https://velog.io/',
      image: 'https://images.velog.io/velog.png',
      date: posts.length > 0 ? posts[0].released_at : new Date(),
    });
    const feeds = posts.map(convertToFeed);
    feeds.forEach((f) => {
      feed.addItem(f);
    });
    ctx.type = 'text/xml; charset=UTF-8';
    ctx.body = feed.atom1();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getUserRSS: Middleware = async (ctx) => {
  const { username } = ctx.params;
  try {
    const user = await User.findOne({
      include: [
        {
          model: UserProfile,
        },
      ],
      where: {
        username,
      },
    });
    if (!user) {
      ctx.status = 404;
      return;
    }
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          include: [UserProfile],
          where: {
            username,
          },
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 20,
      where: {
        is_temp: false,
        is_private: false,
      },
    });
    const feed = new Feed({
      title: `${username} (${user.user_profile.display_name})`,
      description: user.user_profile.short_bio,
      link: `https://velog.io/@${username}`,
      id: `https://velog.io/@${username}`,
      date: posts.length > 0 ? posts[0].released_at : new Date(),
    });
    const feeds = posts.map(convertToFeed);
    feeds.forEach((f) => {
      feed.addItem(f);
    });
    ctx.type = 'text/xml; charset=UTF-8';
    ctx.body = feed.atom1();
  } catch (e) {
    ctx.throw(500, e);
  }
};
