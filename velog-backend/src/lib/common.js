import Sequelize from 'sequelize';

export const primaryUUID = {
  type: Sequelize.UUID,
  defaultValue: Sequelize.UUIDV1,
  primaryKey: true,
};
