const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Parto',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    madre_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'animales', key: 'id' } },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    cantidad_crias: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'partos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
