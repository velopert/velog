// @flow
import GithubAPI from 'github';
import { google } from 'googleapis';
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
          id, avatar_url: thumbnail, email, name,
        } = res.data;

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
    return FacebookAPI.api('me', {
      fields: ['name', 'email', 'picture'],
      access_token: accessToken,
    }).then((auth) => {
      return {
        id: auth.id,
        name: auth.name,
        email: auth.email || null,
        thumbnail: auth.picture.data.url,
      };
    });
  },
  async google(accessToken: string): Promise<Profile> {
    const people = google.people('v1');
    const profile = await people.people.get({
      access_token: accessToken,
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    });
    const { data } = profile;
    const socialProfile = {
      email: data.emailAddresses[0].value || null,
      name: data.names[0].displayName || 'emptyname',
      thumbnail: data.photos[0].url || null,
      id: data.resourceName.replace('people/', ''),
    };
    return socialProfile;
  },
};

export default function getSocialProfile(
  provider: string,
  accessToken: string,
) {
  return profileGetters[provider](accessToken);
}
