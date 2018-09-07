// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID, extractKeys } from 'lib/common';
import { Post, User, UserProfile } from 'database/models';

const Comment = db.define(
  'comment',
  {
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
    deleted: {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
  },
  {
    indexes: [
      {
        fields: ['created_at'],
      },
    ],
  },
);

Comment.associate = function associate() {
  Comment.belongsTo(Post, {
    foreignKey: 'fk_post_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
  Comment.belongsTo(User, {
    foreignKey: 'fk_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'restrict',
  });
};

export type WriteParams = {
  postId: string,
  userId: string,
  text: string,
  replyTo: ?string,
  level: number,
};

Comment.getCommentsCount = async function (postId: string) {
  return Comment.count({
    where: {
      fk_post_id: postId,
      deleted: false,
    },
  });
};

Comment.getCommentsCountList = function (postIds: string[]) {
  return postIds.map(this.getCommentsCount);
};

Comment.readComment = async function (commentId: string) {
  try {
    const data = await Comment.findOne({
      include: [
        {
          model: User,
          attributes: ['username'],
          include: [
            {
              model: UserProfile,
              attributes: ['thumbnail'],
            },
          ],
        },
      ],
      where: {
        id: commentId,
      },
    });
    if (!data) return null;
    const serialized = this.serialize(data);
    serialized.replies_count = await Comment.countChildrenOf(commentId);
    return serialized;
  } catch (e) {
    throw e;
  }
};

Comment.countChildrenOf = function (id) {
  return Comment.count({
    where: {
      reply_to: id,
      deleted: false,
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
  postId, replyTo, offset = 0, order,
}) {
  try {
    const { rows: data, count } = await Comment.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['username'],
          include: [
            {
              model: UserProfile,
              attributes: ['thumbnail'],
            },
          ],
        },
      ],
      where: {
        fk_post_id: postId,
        ...(replyTo ? { reply_to: replyTo } : { level: 0 }),
      },
      order: [['created_at', 'ASC']],
      // limit: 20,
      offset,
    });
    if (!data) return [];
    // TODO: Pagination
    const comments = data.map(c => c.toJSON());
    for (let i = 0; i < comments.length; i++) {
      if (!comments[i].has_replies) {
        comments[i].replies_count = 0;
        continue;
      }
      // TODO: optimization needed
      comments[i].replies_count = await Comment.countChildrenOf(comments[i].id);
    }
    return {
      data: comments.map(Comment.serialize),
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
  const serialized = Object.assign(
    extractKeys(data, [
      'id',
      'text',
      'likes',
      'meta_json',
      'reply_to',
      'actual_reply_to',
      'level',
      'created_at',
      'updated_at',
    ]),
    {
      user: {
        username: data.user.username,
        thumbnail: data.user.user_profile.thumbnail,
      },
      replies_count: data.replies_count || 0,
    },
  );
  if (data.deleted) {
    serialized.text = null;
    serialized.user = {
      username: null,
      thumbnail: null,
    };
  }
  return serialized;
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
