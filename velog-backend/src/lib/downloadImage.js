import axios from 'axios';
import fs from 'fs';
import tmp from 'tmp';
import AWS from 'aws-sdk';
import mimeTypes from 'mime-types';

const s3 = new AWS.S3({ region: 'ap-northeast-2', signatureVersion: 'v4' });

async function downloadImage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
    });
    const contentType = response.headers['content-type'];
    const extension = mimeTypes.extension(contentType);
    const fileName = `(${new Date().getTime()}.${extension}`;
    const imagePath = `profiles/username/${fileName}`;
    const tmpObject = tmp.fileSync();
    response.data.pipe(fs.createWriteStream(tmpObject.name));
    const stream = fs.createReadStream(tmpObject.name);
    return {
      stream,
      extension,
      contentType,
    };
  } catch (e) {
    throw e;
  }

  // const s3response = await s3
  //   .upload({
  //     Bucket: 's3.images.velog.io',
  //     Key: imagePath,
  //     Body: read,
  //     ContentType: contentType,
  //   })
  //   .promise();
  // return s3response;
}

export default downloadImage;
