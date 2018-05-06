import axios from 'axios';
import fs from 'fs';
import tmp from 'tmp';
import AWS from 'aws-sdk';
import mimeTypes from 'mime-types';

const s3 = new AWS.S3({ region: 'ap-northeast-2', signatureVersion: 'v4' });

async function downloadImage(url) {
  try {
    const response = await axios.get(encodeURI(url), {
      responseType: 'stream',
    });
    const contentType = response.headers['content-type'];
    const extension = mimeTypes.extension(contentType);
    const fileName = `(${new Date().getTime()}.${extension}`;
    const imagePath = `profiles/username/${fileName}`;
    const tmpObject = tmp.fileSync();
    const ws = fs.createWriteStream(tmpObject.name);
    response.data.pipe(ws);
    await new Promise(resolve =>
      ws.on('finish', () => {
        resolve();
      }));

    const stream = fs.createReadStream(tmpObject.name);
    const stats = fs.statSync(tmpObject.name);
    // tmpObject.removeCallback();
    return {
      stream,
      extension,
      contentType,
      stats,
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
