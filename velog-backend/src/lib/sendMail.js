// @flow
import AWS from 'aws-sdk';
import striptags from 'striptags';

const ses = new AWS.SES({ region: 'us-east-1' });

type EmailParams = {
  to: string | Array<string>,
  subject: string,
  body: string,
  from: string
};

const sendMail = ({
  to,
  subject,
  body,
  from = 'Velog <support@velog.io>',
}: EmailParams): Promise<*> => {
  return new Promise((resolve, reject) => {
    const params = {
      Destination: {
        ToAddresses: (() => {
          if (typeof to === 'string') {
            return [to];
          }
          return to;
        })(),
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
          Text: {
            Charset: 'UTF-8',
            Data: striptags(body),
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: from,
    };

    ses.sendEmail(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

export default sendMail;
