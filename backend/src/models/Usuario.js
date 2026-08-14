const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Usuario',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING(255), allowNull: false },
    rol: { type: DataTypes.ENUM('ADMINISTRADOR', 'DUEÑO', 'VETERINARIO', 'EMPLEADO'), allowNull: false, defaultValue: 'EMPLEADO' },
    finca_id: { type: DataTypes.INTEGER, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    ultimo_acceso: { type: DataTypes.DATE, allowNull: true },
  },
  options: {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
