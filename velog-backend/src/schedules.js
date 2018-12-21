import axios from 'axios';

export const checkImageFileSize = async (event, context, callback) => {
  await axios.get('https://api.velog.io/internal/check-file-size');
  callback(null, {
    message: 'checkImageFileSize initiated',
  });
};
