const { sequelize } = require('../config/database');

const Finca = sequelize.define('Finca', require('./Finca').attributes, require('./Finca').options);
const Especie = sequelize.define('Especie', require('./Especie').attributes, require('./Especie').options);
const Raza = sequelize.define('Raza', require('./Raza').attributes, require('./Raza').options);
const Potrero = sequelize.define('Potrero', require('./Potrero').attributes, require('./Potrero').options);
const Animal = sequelize.define('Animal', require('./Animal').attributes, require('./Animal').options);
const Usuario = sequelize.define('Usuario', require('./Usuario').attributes, require('./Usuario').options);
const Pesaje = sequelize.define('Pesaje', require('./Pesaje').attributes, require('./Pesaje').options);
const Movimiento = sequelize.define('Movimiento', require('./Movimiento').attributes, require('./Movimiento').options);
const Vacuna = sequelize.define('Vacuna', require('./Vacuna').attributes, require('./Vacuna').options);
const AplicacionVacuna = sequelize.define('AplicacionVacuna', require('./AplicacionVacuna').attributes, require('./AplicacionVacuna').options);
const Enfermedad = sequelize.define('Enfermedad', require('./Enfermedad').attributes, require('./Enfermedad').options);
const Tratamiento = sequelize.define('Tratamiento', require('./Tratamiento').attributes, require('./Tratamiento').options);
const Reproduccion = sequelize.define('Reproduccion', require('./Reproduccion').attributes, require('./Reproduccion').options);
const Parto = sequelize.define('Parto', require('./Parto').attributes, require('./Parto').options);
const ProduccionLeche = sequelize.define('ProduccionLeche', require('./ProduccionLeche').attributes, require('./ProduccionLeche').options);
const Inventario = sequelize.define('Inventario', require('./Inventario').attributes, require('./Inventario').options);
const MovimientoInventario = sequelize.define('MovimientoInventario', require('./MovimientoInventario').attributes, require('./MovimientoInventario').options);
const Compra = sequelize.define('Compra', require('./Compra').attributes, require('./Compra').options);
const DetalleCompra = sequelize.define('DetalleCompra', require('./DetalleCompra').attributes, require('./DetalleCompra').options);
const Venta = sequelize.define('Venta', require('./Venta').attributes, require('./Venta').options);
const DetalleVenta = sequelize.define('DetalleVenta', require('./DetalleVenta').attributes, require('./DetalleVenta').options);
const Gasto = sequelize.define('Gasto', require('./Gasto').attributes, require('./Gasto').options);
const Notificacion = sequelize.define('Notificacion', require('./Notificacion').attributes, require('./Notificacion').options);
const Configuracion = sequelize.define('Configuracion', require('./Configuracion').attributes, require('./Configuracion').options);
const Auditoria = sequelize.define('Auditoria', require('./Auditoria').attributes, require('./Auditoria').options);

require('./associations')({ Finca, Especie, Raza, Potrero, Animal, Usuario, Pesaje, Movimiento, Vacuna, AplicacionVacuna, Enfermedad, Tratamiento, Reproduccion, Parto, ProduccionLeche, Inventario, MovimientoInventario, Compra, DetalleCompra, Venta, DetalleVenta, Gasto, Notificacion, Configuracion, Auditoria });

module.exports = {
  Finca,
  Especie,
  Raza,
  Potrero,
  Animal,
  Usuario,
  Pesaje,
  Movimiento,
  Vacuna,
  AplicacionVacuna,
  Enfermedad,
  Tratamiento,
  Reproduccion,
  Parto,
  ProduccionLeche,
  Inventario,
  MovimientoInventario,
  Compra,
  DetalleCompra,
  Venta,
  DetalleVenta,
  Gasto,
  Notificacion,
  Configuracion,
  Auditoria,
  sequelize,
};
