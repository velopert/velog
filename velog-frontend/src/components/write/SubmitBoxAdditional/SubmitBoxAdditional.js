// @flow
import React from 'react';
import Button from 'components/common/Button';
import SelectBox from 'components/common/SelectBox/SelectBox';
import type { Meta } from 'store/modules/write';
import removeMd from 'remove-markdown';

import './SubmitBoxAdditional.scss';

type Props = {
  realMeta: ?Meta,
  meta: Meta,
  body: string,
  onChangeShortDescription(e: SyntheticInputEvent<HTMLInputElement>): void,
  onChangeCodeTheme(e: SyntheticInputEvent<HTMLSelectElement>): void,
  onCancel(): void,
  onConfirm(): void,
};

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

function convertToPlainText(markdown: string): string {
  const replaced = markdown.replace(/\n/g, ' ').replace(/```(.*)```/g, '');
  return removeMd(replaced).slice(0, 100);
}

const SubmitBoxAdditional = ({
  realMeta,
  meta,
  body,
  onChangeShortDescription,
  onChangeCodeTheme,
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
            meta.short_description ||
            (realMeta && realMeta.short_description) ||
            (meta.short_description === null ? convertToPlainText(body) : '')
          }
        />
      </section>
      <section>
        <div className="section-title">코드블록 테마</div>
        <SelectBox
          options={codeThemes}
          className="select-theme"
          value={(realMeta && realMeta.code_theme) || meta.code_theme || 'atom-one'}
          onChange={onChangeCodeTheme}
        />
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
