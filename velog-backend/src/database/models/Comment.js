// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID, extractKeys } from 'lib/common';
import { Post, User } from 'database/models';


const Comment = db.define('comment', {
  id: primaryUUID,
  fk_post_id: Sequelize.UUID,
  fk_user_id: Sequelize.UUID,
  text: Sequelize.TEXT,
  likes: {
    defaultValue: 0,
    type: Sequelize.INTEGER,
  },
  meta_json: Sequelize.TEXT,
  reply_to: Sequelize.UUID,
  level: {
    defaultValue: 0,
    type: Sequelize.INTEGER,
  },
  has_replies: {
    defaultValue: false,
    type: Sequelize.BOOLEAN,
  },
}, {
  indexes: [
    {
      fields: ['created_at'],
    },
  ],
});

Comment.associate = function associate() {
  Comment.belongsTo(Post, { foreignKey: 'fk_post_id', onDelete: 'restrict', onUpdate: 'restrict' });
  Comment.belongsTo(User, { foreignKey: 'fk_user_id', onDelete: 'restrict', onUpdate: 'restrict' });
};

export type WriteParams = {
  postId: string,
  userId: string,
  text: string,
  replyTo: ?string,
  level: number
};

Comment.readComment = async function (commentId: string) {
  try {
    const data = await Comment.findOne({
      include: [{
        model: User,
        attributes: ['username'],
      }],
      where: {
        id: commentId,
      },
    });
    if (!data) return null;
    return this.serialize(data);
  } catch (e) {
    throw e;
  }
};

Comment.countChildrenOf = function (id) {
  return Comment.count({
    where: {
      reply_to: id,
    },
  });
};

Comment.getChildrenOf = function (id) {
  return Comment.findAll({
    include: [{ model: User, attributes: ['username'] }],
    where: {
      reply_to: id,
    },
    limit: 20,
  });
};

Comment.listComments = async function ({
  postId,
  replyTo,
  offset = 0,
  order,
}) {
  try {
    const { rows: data, count } = await Comment.findAndCountAll({
      include: [{ model: User, attributes: ['username'] }],
      where: {
        fk_post_id: postId,
        ...(replyTo ? { reply_to: replyTo } : { level: 0 }),
      },
      order: [
        ['created_at', 'DESC'],
      ],
      limit: 20,
      offset,
    });
    if (!data) return [];
    // TODO: Pagination
    const comments = data.map(c => c.toJSON());
    /*
    const fetchChildren = async (list: any[], level = 0) => {
      for (let i = 0; i < list.length; i++) {
        if (!list[i].has_replies) continue;
        const children = await Comment.getChildrenOf(list[i].id);
        const childrenJSON = children.map(c => c.toJSON());
        list[i].children = childrenJSON;
        if (level === 2) return;
        return fetchChildren(childrenJSON, level + 1);
      }
    };
    await fetchChildren(comments);
    */
    for (let i = 0; i < comments.length; i++) {
      if (!comments[i].has_replies) continue;
      comments[i].replies_count = await Comment.countChildrenOf(comments[i].id);
    }
    return {
      data: comments,
      count,
    };
  } catch (e) {
    throw e;
  }
};

Comment.write = function ({
  postId,
  userId,
  text,
  replyTo,
  level,
}: WriteParams) {
  return Comment.build({
    fk_user_id: userId,
    fk_post_id: postId,
    text,
    reply_to: replyTo,
    level,
  }).save();
};

Comment.serialize = (data: any) => {
  return Object.assign(extractKeys(data, [
    'id', 'text', 'likes', 'meta_json', 'reply_to',
    'actual_reply_to', 'level', 'created_at', 'updated_at',
  ]), {
    username: data.user.username,
  });
};

export default Comment;
/* COMMENT LOGIC
  1) Ordinary Comment ✅
    - level: 0
    - replyTo: null
  2) Level 1 Comment
    - level: 1
    - replyTo: level_0_id
  3) Level 2 Comment
    - level: 2
    - replyTo: level_1_id
  4) Level 3 Comment
    - level: 3
    - replyTo: level_2_id
  5) Level 4 Comment (Try)
    - level: 3
    - replyTo: level_2_id
    - actual_reply_to: level_3_id

  LISTING LOGIC

  a. List postId=id, level:0
  b. Foreach Comments
    if hasReplies then fetch
  c. forEach comments2
    if has replies then fetch
  d. forEach comments3
    if has replies then fetch
*/
