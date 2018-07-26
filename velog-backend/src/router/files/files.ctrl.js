// @flow
import type { Middleware, Context } from 'koa';
import fs from 'fs';
import AWS from 'aws-sdk';
import filesize from 'filesize';
import Post from 'database/models/Post';
import PostImage from 'database/models/PostImage';
import { isUUID } from 'lib/common';
import downloadImage from 'lib/downloadImage';
import mimeTypes from 'mime-types';
import UserThumbnail from 'database/models/UserThumbnail';

const s3 = new AWS.S3({ region: 'ap-northeast-2', signatureVersion: 'v4' });

export const createPostImageSignedUrl: Middleware = async (ctx: Context) => {
  const { post_id, filename } = (ctx.request.body: any);
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

  try {
    const contentType = mimeTypes.contentType(filename);
    const postImage = PostImage.build({
      fk_post_id: post_id,
      fk_user_id: ctx.user.id,
    });
    const imagePath = `post-images/${ctx.user.username}/${
      postImage.id
    }/${filename}`;
    postImage.path = imagePath;
    await postImage.save();
    const url = await s3.getSignedUrl('putObject', {
      Bucket: 's3.images.velog.io',
      Key: imagePath,
      ContentType: contentType,
    });
    ctx.body = {
      url,
      imagePath,
      id: postImage.id,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const retrieveSize: Middleware = async (ctx: Context) => {
  // find file row from db
  try {
    const fileInfo = await PostImage.findById(ctx.params.id);
    console.log(fileInfo);
    console.log(`https://images.velog.io/${fileInfo.path}`);
    const downloaded = await downloadImage(`https://images.velog.io/${fileInfo.path}`);
    fileInfo.filesize = downloaded.stats.size;
    await fileInfo.save();
    ctx.body = {
      filesize: downloaded.stats.size,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
  // download file
  // get filesize
  // update filesize
  // return result
};

export const createThumbnailSignedUrl: Middleware = async (ctx) => {
  const { id: userId, username } = ctx.user;
  const { filename } = (ctx.request.body: any);

  try {
    const contentType = mimeTypes.contentType(filename);
    const userThumbnail = UserThumbnail.build({
      fk_user_id: userId,
    });
    const imagePath = `thumbnails/${username}/${userThumbnail.id}-${filename}`;
    userThumbnail.path = imagePath;
    await userThumbnail.save();
    const url = await s3.getSignedUrl('putObject', {
      Bucket: 's3.images.velog.io',
      Key: imagePath,
      ContentType: contentType,
    });
    ctx.body = {
      url,
      image_path: imagePath,
      id: userThumbnail.id,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const upload: Middleware = async (ctx: Context) => {
  const { files, fields } = (ctx.request.body: any);
  // check whether every parameter exists
  const { image } = files;
  console.log(image);
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

  if (!stats) {
    ctx.throw(500, 'failed to load stats');
    return;
  }
  if (stats.size > 1024 * 1024 * 8) {
    ctx.status = 413;
    ctx.body = {
      name: 'FILE_SIZE_EXCEEDS',
      payload: '8MB',
    };
    return;
  }
  // if no prob, create data
  try {
    const postImage = PostImage.build({
      fk_post_id: post_id,
      fk_user_id: ctx.user.id,
      filesize: stats.size,
    });
    const imagePath = `post-images/${ctx.user.username}/${postImage.id}/${
      image.name
    }`;
    console.log(imagePath);
    postImage.path = imagePath;
    const read = fs.createReadStream(image.path);
    const response = await s3
      .upload({
        Bucket: 's3.images.velog.io',
        Key: imagePath,
        Body: read,
        ContentType: image.type,
      })
      .promise();
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
