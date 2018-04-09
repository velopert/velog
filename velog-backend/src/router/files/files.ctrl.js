// @flow
import type { Middleware, Context } from 'koa';
import fs from 'fs';
import AWS from 'aws-sdk';
import mime from 'mime-types';


const s3 = new AWS.S3();

export const upload: Middleware = async (ctx: Context) => {
  // try {
  //   const a = await s3.putObject({
  //     Bucket: 's3.images.velog.io',
  //     Key: 'mistake.txt',
  //     Body: 'hellozz',
  //   }).promise();
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log(ctx.request.body);
  const { image } = (ctx.request.body: any).files;
  const read = fs.createReadStream(image.path);

  try {
    const response = await s3.upload({
      Bucket: 's3.images.velog.io',
      Key: image.name,
      Body: read,
      ContentType: image.type,
    }, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
    }).promise();
    ctx.body = response;
  } catch (e) {
    ctx.throw(500, e);
  }
};
