const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Raza',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    especie_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'especies', key: 'id' } },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVA', 'INACTIVA'), defaultValue: 'ACTIVA' },
  },
  options: {
    tableName: 'razas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
