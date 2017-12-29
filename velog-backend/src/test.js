const AWS = require('aws-sdk');

const ses = new AWS.SES({region: 'us-east-1'});

const params = {
  Destination: {
    ToAddresses: ['public.velopert@gmail.com']
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data:
          'This message body contains HTML formatting, like <a class="ulink" href="http://docs.aws.amazon.com/ses/latest/DeveloperGuide" target="_blank">Amazon SES Developer Guide</a>.'
      },
      Text: {
        Charset: 'UTF-8',
        Data: 'This is the message body in text format.'
      }
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Test email from code'
    
    }
  },
  Source: 'Velog <verification@velog.io>'
}

ses.sendEmail(params, (err, data) => {
  if (err) console.log(err, err.stack)
  else console.log(data)
})