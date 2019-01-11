// @flow
import React from 'react';
import Button from 'components/common/Button';
import SelectBox from 'components/common/SelectBox/SelectBox';
import type { Meta } from 'store/modules/write';
import { convertToPlainText } from 'lib/common';

import './SubmitBoxAdditional.scss';

type Props = {
  realMeta: ?Meta,
  meta: Meta,
  body: string,
  urlSlug: ?string,
  username: string,
  onChangeShortDescription(e: SyntheticInputEvent<HTMLInputElement>): void,
  onChangeCodeTheme(e: SyntheticInputEvent<HTMLSelectElement>): void,
  onChangeUrlSlug(e: SyntheticInputEvent<HTMLInputElement>): void,
  onCancel(): void,
  onConfirm(): void,
};

const codeThemes = [
  {
    id: 'github',
    text: 'Github',
  },
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
    id: 'monokai',
    text: 'Monokai',
  },
];

const SubmitBoxAdditional = ({
  realMeta,
  meta,
  username,
  body,
  urlSlug,
  onChangeShortDescription,
  onChangeCodeTheme,
  onChangeUrlSlug,
  onCancel,
  onConfirm,
}: Props) => (
  <div className="SubmitBoxAdditional">
    <div className="sections">
      <section>
        <div className="section-title">포스트 설명</div>
        <textarea
          rows="4"
          onChange={onChangeShortDescription}
          value={
            meta.short_description /* ||
            (realMeta && realMeta.short_description) ||
            (meta.short_description === null ? convertToPlainText(body) : '') */
          }
        />
      </section>
      <section>
        <div className="section-title">코드블록 테마</div>
        <SelectBox
          options={codeThemes}
          className="select-theme"
          value={meta.code_theme || 'github'}
          onChange={onChangeCodeTheme}
        />
      </section>
      <section>
        <div className="section-title">URL</div>
        <div className="url">
          <div className="base">/@{username}/</div>
          <input value={urlSlug} onChange={onChangeUrlSlug} />
        </div>
      </section>
    </div>
    <div className="buttons">
      <Button theme="paper" onClick={onCancel}>
        취소
      </Button>
      <Button theme="paper" violetFont onClick={onConfirm}>
        확인
      </Button>
    </div>
  </div>
);

export default SubmitBoxAdditional;
