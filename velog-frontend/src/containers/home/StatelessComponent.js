// @flow
import React from 'react';
import { Map, Record, List } from 'immutable';

type Props = {
  foo: number,
  bar: string,
  onClick: (e: Event) => mixed
};

const StatelessComponent = ({ foo, bar, onClick }: Props) => {
  return (
    <div>
      {foo} {bar}
    </div>
  );
};

export default StatelessComponent;
