const { Op } = require('sequelize');

const ALLOWED_SORT_FIELDS = new Set([
  'id',
  'created_at',
  'updated_at',
  'fecha',
  'fecha_nacimiento',
  'fecha_aplicacion',
  'proxima_dosis',
  'total',
  'nombre',
  'estado',
  'sexo',
]);

const ALLOWED_SORT_ORDERS = new Set(['ASC', 'DESC']);

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function buildPagination({ page, limit }) {
  const p = Math.max(DEFAULT_PAGE, parseInt(page, 10) || DEFAULT_PAGE);
  const l = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit, 10) || DEFAULT_LIMIT));
  return { page: p, limit: l, offset: (p - 1) * l };
}

function buildSort(sortBy, sortOrder) {
  const field = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : 'created_at';
  const order = ALLOWED_SORT_ORDERS.has(sortOrder?.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
  return [[field, order]];
}

function buildDateRange(fechaInicio, fechaFin) {
  const where = {};
  if (fechaInicio && fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (inicio > fin) {
      throw new Error('La fecha inicial no puede ser mayor que la fecha final');
    }
    where.fecha = { [Op.between]: [inicio, fin] };
  } else if (fechaInicio) {
    where.fecha = { [Op.gte]: new Date(fechaInicio) };
  } else if (fechaFin) {
    where.fecha = { [Op.lte]: new Date(fechaFin) };
  }
  return where;
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(fechaNacimiento);
  const ahora = new Date();
  const edad = ahora.getFullYear() - nacimiento.getFullYear();
  const m = ahora.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && ahora.getDate() < nacimiento.getDate())) {
    return edad - 1;
  }
  return edad;
}

function estadoVacunacion(proximaDosis) {
  if (!proximaDosis) return 'PENDIENTE';
  const dias = Math.ceil((new Date(proximaDosis) - new Date()) / (1000 * 60 * 60 * 24));
  if (dias < 0) return 'VENCIDA';
  if (dias <= 7) return 'PROXIMA';
  return 'PENDIENTE';
}

module.exports = {
  buildPagination,
  buildSort,
  buildDateRange,
  calcularEdad,
  estadoVacunacion,
  ALLOWED_SORT_FIELDS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
