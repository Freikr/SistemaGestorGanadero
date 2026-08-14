const { sequelize } = require('../../config/database');
const { Animal, Venta, Compra, Gasto, Inventario, Notificacion } = require('../models');

async function obtenerDashboard(fincaId) {
  const animalesResult = await Animal.findAll({
    where: { finca_id: fincaId },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
      [sequelize.fn('SUM', sequelize.literal("CASE WHEN estado = 'ACTIVO' THEN 1 ELSE 0 END")), 'activos'],
      [sequelize.fn('SUM', sequelize.literal("CASE WHEN estado = 'VENDIDO' THEN 1 ELSE 0 END")), 'vendidos'],
      [sequelize.fn('SUM', sequelize.literal("CASE WHEN estado = 'FALLECIDO' THEN 1 ELSE 0 END")), 'fallecidos'],
    ],
    raw: true,
  });

  const ventasResult = await Venta.findOne({
    where: { finca_id: fincaId, estado: 'COMPLETADA' },
    attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total']],
    raw: true,
  });

  const comprasResult = await Compra.findOne({
    where: { finca_id: fincaId, estado: 'COMPLETADA' },
    attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total']],
    raw: true,
  });

  const gastosResult = await Gasto.findOne({
    where: { finca_id: fincaId },
    attributes: [[sequelize.fn('SUM', sequelize.col('monto')), 'total']],
    raw: true,
  });

  const inventarioResult = await Inventario.findAll({
    where: { finca_id: fincaId },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalProductos'],
      [sequelize.fn('SUM', sequelize.literal("CASE WHEN cantidad_actual <= stock_minimo THEN 1 ELSE 0 END")), 'stockBajo'],
    ],
    raw: true,
  });

  const notificacionesResult = await Notificacion.count({
    where: { leida: false },
  });

  return {
    animales: {
      total: parseInt(animalesResult[0]?.total || 0, 10),
      activos: parseInt(animalesResult[0]?.activos || 0, 10),
      vendidos: parseInt(animalesResult[0]?.vendidos || 0, 10),
      fallecidos: parseInt(animalesResult[0]?.fallecidos || 0, 10),
    },
    finanzas: {
      ventas: parseFloat(ventasResult?.total || 0),
      compras: parseFloat(comprasResult?.total || 0),
      gastos: parseFloat(gastosResult?.total || 0),
      balance: parseFloat(ventasResult?.total || 0) - parseFloat(comprasResult?.total || 0) - parseFloat(gastosResult?.total || 0),
    },
    inventario: {
      productos: parseInt(inventarioResult[0]?.totalProductos || 0, 10),
      stockBajo: parseInt(inventarioResult[0]?.stockBajo || 0, 10),
      proximosVencer: 0,
    },
    notificaciones: parseInt(notificacionesResult, 10),
  };
}

async function obtenerReporteAnimales(fincaId) {
  return await Animal.findAll({
    where: { finca_id: fincaId },
    include: [
      { model: require('../models/Especie'), as: 'especie', attributes: ['nombre'] },
      { model: require('../models/Raza'), as: 'raza', attributes: ['nombre'] },
    ],
    attributes: ['id', 'arete', 'nombre', 'sexo', 'estado', 'fecha_nacimiento'],
    order: [['created_at', 'DESC']],
  });
}

async function obtenerReporteVentas(fincaId, fechaInicio, fechaFin) {
  const where = { finca_id: fincaId, estado: 'COMPLETADA' };

  if (fechaInicio && fechaFin) {
    where.fecha = { [sequelize.Op.between]: [fechaInicio, fechaFin] };
  }

  return await Venta.findAll({
    where,
    include: [{ model: require('../models/DetalleVenta'), as: 'detalles', include: [{ model: require('../models/Animal'), as: 'animal' }] }],
    order: [['fecha', 'DESC']],
  });
}

async function obtenerReporteInventario(fincaId) {
  return await Inventario.findAll({
    where: { finca_id: fincaId },
    order: [['nombre', 'ASC']],
  });
}

module.exports = {
  obtenerDashboard,
  obtenerReporteAnimales,
  obtenerReporteVentas,
  obtenerReporteInventario,
};
