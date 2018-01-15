// @flow
import GithubAPI from 'github';
import GoogleAPI from 'googleapis';
import FacebookAPI from 'fb';

export type Profile = {
  id: number | string,
  thumbnail: ?string,
  email: ?string,
  name: ?string,
};

const profileGetters = {
  github(accessToken: string): Promise<Profile> {
    const github = new GithubAPI();
    github.authenticate({
      type: 'token',
      token: accessToken,
    });
    return new Promise((resolve, reject) => {
      github.users.get({}, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        const {
          id,
          avatar_url: thumbnail,
          email,
          name,
        } = res.data;

        console.log(res.data);

        const profile = {
          id,
          thumbnail,
          email,
          name,
        };

        resolve(profile);
      });
    });
  },
  facebook(accessToken: string): Promise<Profile> {
    return FacebookAPI.api('me', { fields: ['name', 'email', 'picture'], access_token: accessToken })
      .then((auth) => {
        return {
          id: auth.id,
          name: auth.name,
          email: auth.email || null,
          thumbnail: auth.picture.data.url,
        };
      });
  },
  google(accessToken: string): Promise<Profile> {
    const plus = GoogleAPI.plus('v1');
    return new Promise((resolve, reject) => {
      plus.people.get({
        userId: 'me',
        access_token: accessToken,
      }, (err, auth) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(auth);
        const {
          id,
          image,
          emails,
          displayName,
        } = auth;

        const profile = {
          id,
          thumbnail: image.url,
          email: emails[0].value,
          name: displayName && displayName.split(' (')[0],
        };
        resolve(profile);
      });
    });
  },
};

export default function getSocialProfile(provider: string, accessToken: string) {
  return profileGetters[provider](accessToken);
}
