// @flow
import GithubAPI from 'github';
import GoogleAPI from 'googleapis';
import FacebookAPI from 'fb';

const profileGetters = {
  github(accessToken: string) {
    const github = new GithubAPI();
    github.authenticate({
      type: 'token',
      token: accessToken,
    });
    return new Promise((resolve, reject) => {
      github.users.get({}, (err, res) => {
        if (err) reject(err);
        const {
          id,
          avatar_url: thumbnail,
          email,
        } = res.data;

        const profile = {
          id,
          thumbnail,
          email,
        };

        resolve(profile);
      });
    });
  },
  facebook(accessToken: string) {
    return FacebookAPI.api('me', { fields: ['email', 'picture'], access_token: accessToken })
      .then(auth => ({
        id: auth.id,
        email: auth.email || null,
        thumbnail: auth.picture.data.url,
      }));
  },
  google(accessToken: string) {
    const plus = GoogleAPI.plus('v1');
    return new Promise((resolve, reject) => {
      plus.people.get({
        userId: 'me',
        access_token: accessToken,
      }, (err, auth) => {
        console.log(err, auth);
        if (err) {
          reject(err);
          return;
        }
        const {
          id,
          image,
          emails,
        } = auth;

        const profile = {
          id,
          thumbnail: image.url,
          email: emails[0].value,
        };
        resolve(profile);
      });
    });
  },
};

export default function getSocialProfile(provider: string, accessToken: string) {
  return profileGetters[provider](accessToken);
}
