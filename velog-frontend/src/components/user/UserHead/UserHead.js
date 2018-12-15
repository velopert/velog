// @flow
import React from 'react';
import defaultThumbnail from 'static/images/default_thumbnail.png';
import Button from 'components/common/Button';
import { type Profile } from 'store/modules/profile';
import { Helmet } from 'react-helmet';
import { resizeImage } from 'lib/common';
import GithubIcon from 'react-icons/lib/fa/github-square';
import TwitterIcon from 'react-icons/lib/fa/twitter-square';
import FacebookIcon from 'react-icons/lib/fa/facebook-square';
import EmailIcon from 'react-icons/lib/md/email';
import LinkIcon from 'react-icons/lib/md/insert-link';

import './UserHead.scss';

type Props = {
  username: string,
  profile: Profile,
  self: boolean,
  following: ?boolean,
  rawTagName: ?string,
  onToggleFollow: () => void,
};

const UserHead = ({ username, profile, self, following, onToggleFollow, rawTagName }: Props) => {
  const title = `${username} (${profile.display_name})${rawTagName ? ` #${rawTagName}` : ''}`;
  const { github, twitter, facebook, email, url } = profile.profile_links;
  const hasAccount = !!(github || twitter || facebook);
  const hasLink = !!(url || email);

  return (
    <div className="UserHead">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={profile.short_bio} />
      </Helmet>
      <img src={resizeImage(profile.thumbnail || defaultThumbnail, 256)} alt="thumbnail" />
      <div className="user-info">
        <section className="top">
          {!self &&
            following !== undefined && (
              <div className="subscribe-wrapper">
                {following ? (
                  <Button className="subscribe" theme="gray" onClick={onToggleFollow}>
                    구독중
                  </Button>
                ) : (
                  <Button className="subscribe" onClick={onToggleFollow}>
                    구독하기
                  </Button>
                )}
              </div>
            )}
          <div className="username">@{username}</div>
        </section>
        <section className="profile-content">
          <h2>{profile.display_name}</h2>
          <p>{profile.short_bio}</p>
          <div className="social-info">
            {hasAccount && (
              <div className="icons">
                {github && (
                  <a href={`https://github.com/${github}`} target="_blank">
                    <GithubIcon />
                  </a>
                )}
                {twitter && (
                  <a href={`https://twitter.com/${twitter}`} target="_blank">
                    <TwitterIcon />
                  </a>
                )}
                {facebook && (
                  <a href={`https://facebook.com/${facebook}`} target="_blank">
                    <FacebookIcon />
                  </a>
                )}
              </div>
            )}
            {hasLink && (
              <div className="other-links">
                {email && (
                  <div className="link-line">
                    <EmailIcon />
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                )}
                {url && (
                  <div className="link-line">
                    <LinkIcon />
                    <a href={url} target="_blank">
                      {url}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

UserHead.Placeholder = () => (
  <div className="UserHead placeholder">
    <div className="fake-thumbnail" />
    <div className="user-info">
      <section className="top">
        <div className="username">
          <div className="gray-block _username" />
        </div>
      </section>
      <section className="mini-profile">
        <div className="gray-block _name" />
        <div className="gray-block _description" />
      </section>
    </div>
  </div>
);

export default UserHead;
