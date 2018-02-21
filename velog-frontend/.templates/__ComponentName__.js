// @flow
import React/* IF class */, { Component }/* ENDIF */ from 'react';
/* ENDIF */
import './__ComponentName__.scss';

type Props = { }

/* IF !class */
const __ComponentName__ = (props: Props) => (
  <div className="__ComponentName__">
    __ComponentName__
  </div>
);
/* ENDIF *//* IF class*/
class __ComponentName__ extends Component<Props> {
  render() {
    return (
      <div className="__ComponentName__">
        __ComponentName__
      </div>
    );
  }
}
/* ENDIF */

export default __ComponentName__;