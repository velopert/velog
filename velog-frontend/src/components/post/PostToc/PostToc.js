// @flow
import React from 'react';
import type { TocItem } from 'store/modules/posts';
import './PostToc.scss';

type Props = {
  toc: ?(TocItem[]),
};

const PostToc = ({ toc }: Props) => {
  if (!toc) return null;
  console.log(toc);
  return (
    <div className="PostToc">
      <div className="wrapper">
        <ul>
          {toc.map(({ anchor, level, text }) => (
            <li
              style={{
                paddingLeft: `${(level === 1 ? 0 : level - 2) * 0.5}rem`,
              }}
            >
              <a href={`#${anchor}`}>{text}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostToc;
