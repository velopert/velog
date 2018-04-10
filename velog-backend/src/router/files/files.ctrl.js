// @flow
import type { Middleware, Context } from 'koa';
import fs from 'fs';
import AWS from 'aws-sdk';
import filesize from 'filesize';

const s3 = new AWS.S3();

export const upload: Middleware = async (ctx: Context) => {
  console.log(ctx.request.body);
  const { image } = (ctx.request.body: any).files;
  const imagePath = `post-images/${ctx.user.username}/UUID/${image.name}`;
  const read = fs.createReadStream(image.path);
  const stats = fs.statSync(image.path);
  console.log(filesize(stats.size));
  try {
    const response = await s3.upload({
      Bucket: 's3.images.velog.io',
      Key: imagePath,
      Body: read,
      ContentType: image.type,
    }, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
    }).promise();
    ctx.body = {
      image_path: imagePath,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
