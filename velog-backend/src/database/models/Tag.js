// @flow
import Sequelize from 'sequelize';
import db from 'database/db';
import { primaryUUID } from 'lib/common';

export type TagModel = {
  id: string,
  name: string
};

const Tag = db.define('tag', {
  id: primaryUUID,
  name: Sequelize.STRING,
});

export default Tag;
