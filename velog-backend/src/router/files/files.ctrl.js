// @flow
import type { Middleware, Context } from 'koa';
import fs from 'fs';
import AWS from 'aws-sdk';
import filesize from 'filesize';
import Post from 'database/models/Post';
import PostImage from 'database/models/PostImage';
import { isUUID } from 'lib/common';


const s3 = new AWS.S3();

export const upload: Middleware = async (ctx: Context) => {
  const { files, fields } = (ctx.request.body: any);
  // check whether every parameter exists
  const { image } = files;
  if (!image) {
    ctx.status = 400;
    ctx.body = {
      name: 'FILE_NOT_GIVEN',
    };
    return;
  }
  const { post_id } = fields;
  if (!post_id) {
    ctx.status = 400;
    ctx.body = {
      name: 'POST_ID_NOT_GIVEN',
    };
    return;
  }

  // CHECK UUID
  if (!isUUID(post_id)) {
    ctx.status = 400;
    ctx.body = {
      name: 'NOT_UUID',
    };
    return;
  }

  // check whether post exists
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      ctx.status = 404;
      ctx.body = {
        name: 'POST_NOT_FOUND',
      };
      return;
    }
    // check whether user owns the post
    if (post.fk_user_id !== ctx.user.id) {
      ctx.body = {
        name: 'NOT_OWN_POST',
      };
      ctx.status = 403;
      return;
    }
  } catch (e) {
    ctx.throw(500, e);
  }

  const stats = fs.statSync(image.path);
  // if no prob, create data
  try {
    const postImage = PostImage.build({
      fk_post_id: post_id,
      fk_user_id: ctx.user.id,
      filesize: stats.size,
    });
    const imagePath = `post-images/${ctx.user.username}/${postImage.id}/${image.name}`;
    postImage.path = imagePath;
    const read = fs.createReadStream(image.path);
    const response = await s3.upload({
      Bucket: 's3.images.velog.io',
      Key: imagePath,
      Body: read,
      ContentType: image.type,
    }).promise();
    if (!response || !response.ETag) {
      console.log(response);
      ctx.status = 418; // I AM A TEAPOT
      return;
    }
    postImage.save();
    ctx.body = postImage.toJSON();
  } catch (e) {
    ctx.throw(500, e);
  }
};
