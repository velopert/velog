// @flow
import React from 'react';
import Button from 'components/common/Button';
import SelectBox from 'components/common/SelectBox/SelectBox';

import './SubmitBoxAdditional.scss';

type Props = {};

const codeThemes = [
  {
    id: 'atom-one',
    text: 'Atom One',
  },
  {
    id: 'dracula',
    text: 'Dracula',
  },
  {
    id: 'duotone-light',
    text: 'Duotone Light',
  },
  {
    id: 'github',
    text: 'Github',
  },
  {
    id: 'monokai',
    text: 'Monokai',
  },
];

const SubmitBoxAdditional = (props: Props) => (
  <div className="SubmitBoxAdditional">
    <div className="sections">
      <section>
        <div className="section-title">포스트 설명</div>
        <textarea rows="4" />
      </section>
      <section>
        <div className="section-title">코드블록 테마</div>
        <SelectBox options={codeThemes} className="select-theme" />
      </section>
    </div>
    <div className="buttons">
      <Button theme="paper">취소</Button>
      <Button theme="paper" violetFont>
        확인
      </Button>
    </div>
  </div>
);

export default SubmitBoxAdditional;
