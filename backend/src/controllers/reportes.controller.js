const { query, param } = require('express-validator');
const reportesService = require('../services/reportes.service');
const authMiddleware = require('../middleware/auth');
const permisosMiddleware = require('../middleware/permisos');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

function validarErrores(req, res, next) {
  const errores = require('express-validator').validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      mensaje: 'Errores de validación',
      errores: errores.array().map((err) => err.msg),
    });
  }
  next();
}

function normalizarRangoFechas(fechaInicio, fechaFin) {
  if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
    throw new Error('La fecha inicial no puede ser mayor que la fecha final');
  }
}

async function dashboard(req, res) {
  try {
    const datos = await reportesService.obtenerDashboard(req.user.finca_id);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteAnimales(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      potreroId: req.query.potreroId,
      especieId: req.query.especieId,
      razaId: req.query.razaId,
      sexo: req.query.sexo,
      estado: req.query.estado,
      edadMin: req.query.edadMin ? parseInt(req.query.edadMin, 10) : undefined,
      edadMax: req.query.edadMax ? parseInt(req.query.edadMax, 10) : undefined,
      orden: req.query.orden,
      direccion: req.query.direccion,
    };
    const paginacion = {
      limit: parseInt(req.query.limit, 10) || 20,
      page: parseInt(req.query.page, 10) || 1,
    };

    const datos = await reportesService.obtenerReporteAnimales(finca_id, filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteMovimientos(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      animalId: req.query.animalId,
      tipoMovimiento: req.query.tipoMovimiento,
    };
    normalizarRangoFechas(filtros.fechaInicio, filtros.fechaFin);

    const paginacion = {
      limit: parseInt(req.query.limit, 10) || 20,
      page: parseInt(req.query.page, 10) || 1,
    };

    const datos = await reportesService.obtenerReporteMovimientos(finca_id, filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteSalud(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      animalId: req.query.animalId,
      vacunaId: req.query.vacunaId,
    };
    normalizarRangoFechas(filtros.fechaInicio, filtros.fechaFin);

    const paginacion = {
      limit: parseInt(req.query.limit, 10) || 20,
      page: parseInt(req.query.page, 10) || 1,
    };

    const datos = await reportesService.obtenerReporteSalud(finca_id, filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteVentas(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      usuarioId: req.query.usuarioId,
      cliente: req.query.cliente,
    };
    normalizarRangoFechas(filtros.fechaInicio, filtros.fechaFin);

    const paginacion = {
      limit: parseInt(req.query.limit, 10) || 20,
      page: parseInt(req.query.page, 10) || 1,
    };

    const datos = await reportesService.obtenerReporteVentas(finca_id, filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteInventario(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      categoria: req.query.categoria,
      estado: req.query.estado,
    };

    const datos = await reportesService.obtenerReporteInventario(finca_id, filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteMortalidad(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      razaId: req.query.razaId,
      sexo: req.query.sexo,
    };
    normalizarRangoFechas(filtros.fechaInicio, filtros.fechaFin);

    const paginacion = {
      limit: parseInt(req.query.limit, 10) || 20,
      page: parseInt(req.query.page, 10) || 1,
    };

    const datos = await reportesService.obtenerReporteMortalidad(finca_id, filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reportePorRaza(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      razaId: req.query.razaId,
    };

    const datos = await reportesService.obtenerReportePorRaza(finca_id, filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reportePorFinca(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      estado: req.query.estado,
    };

    const datos = await reportesService.obtenerReportePorFinca(finca_id, filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteReproduccion(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
    };
    normalizarRangoFechas(filtros.fechaInicio, filtros.fechaFin);

    const paginacion = {
      limit: parseInt(req.query.limit, 10) || 20,
      page: parseInt(req.query.page, 10) || 1,
    };

    const datos = await reportesService.obtenerReporteReproduccion(finca_id, filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reportePoblacion(req, res) {
  try {
    const { finca_id } = req.user;
    const filtros = {
      meses: req.query.meses ? parseInt(req.query.meses, 10) : 12,
    };

    const datos = await reportesService.obtenerReportePoblacion(finca_id, filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function exportarPDF(req, res) {
  try {
    const tipoReporte = req.query.tipo;
    const fincaId = req.user.finca_id;
    const nombre = req.user.nombre;

    if (!tipoReporte) {
      return res.status(400).json({ success: false, mensaje: 'El tipo de reporte es requerido' });
    }

    const doc = new PDFDocument({ margin: 50 });
    const nombreArchivo = `reporte_${tipoReporte}_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    doc.pipe(res);

    doc.fontSize(20).text('Sistema Gestor Ganadero', { align: 'center' });
    doc.fontSize(16).text(`Reporte: ${tipoReporte.toUpperCase()}`, { align: 'center' });
    doc.fontSize(12).text(`Generado: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.text(`Usuario: ${nombre || 'N/A'}`, { align: 'center' });
    doc.moveDown();

    if (tipoReporte === 'animales') {
      const datos = await reportesService.obtenerReporteAnimales(fincaId, {}, { limit: 1000, page: 1 });
      doc.text('Reporte de Inventario del Ganado', { underline: true });
      doc.moveDown();

      datos.data.forEach((animal) => {
        doc.text(
          `ID: ${animal.id} | Arete: ${animal.arete || 'N/A'} | Nombre: ${animal.nombre || 'N/A'} | Sexo: ${animal.sexo} | Estado: ${animal.estado}`
        );
      });
    } else if (tipoReporte === 'ventas') {
      const datos = await reportesService.obtenerReporteVentas(fincaId, {}, { limit: 1000, page: 1 });
      doc.text('Reporte de Ventas', { underline: true });
      doc.moveDown();

      datos.data.forEach((venta) => {
        doc.text(
          `Venta #${venta.id} | Fecha: ${new Date(venta.fecha).toLocaleDateString()} | Total: $${venta.total} | Cliente: ${venta.cliente || 'N/A'}`
        );
      });
    } else if (tipoReporte === 'inventario') {
      const datos = await reportesService.obtenerReporteInventario(fincaId, {});
      doc.text('Reporte de Inventario', { underline: true });
      doc.moveDown();

      datos.data.forEach((producto) => {
        doc.text(
          `${producto.nombre} | Cantidad: ${producto.cantidad_actual} | Stock Min: ${producto.stock_minimo || 'N/A'} | Estado: ${producto.estado}`
        );
      });
    } else {
      doc.text('Tipo de reporte no soportado para exportación PDF');
    }

    doc.end();
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function exportarExcel(req, res) {
  try {
    const tipoReporte = req.query.tipo;
    const fincaId = req.user.finca_id;

    if (!tipoReporte) {
      return res.status(400).json({ success: false, mensaje: 'El tipo de reporte es requerido' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(tipoReporte);

    const nombreArchivo = `reporte_${tipoReporte}_${Date.now()}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

    if (tipoReporte === 'animales') {
      const datos = await reportesService.obtenerReporteAnimales(fincaId, {}, { limit: 1000, page: 1 });
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Arete', key: 'arete', width: 20 },
        { header: 'Nombre', key: 'nombre', width: 20 },
        { header: 'Sexo', key: 'sexo', width: 10 },
        { header: 'Estado', key: 'estado', width: 15 },
      ];

      datos.data.forEach((animal) => {
        worksheet.addRow({
          id: animal.id,
          arete: animal.arete || '',
          nombre: animal.nombre || '',
          sexo: animal.sexo,
          estado: animal.estado,
        });
      });
    } else if (tipoReporte === 'ventas') {
      const datos = await reportesService.obtenerReporteVentas(fincaId, {}, { limit: 1000, page: 1 });
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Cliente', key: 'cliente', width: 25 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Metodo Pago', key: 'metodo_pago', width: 15 },
      ];

      datos.data.forEach((venta) => {
        worksheet.addRow({
          id: venta.id,
          fecha: new Date(venta.fecha).toLocaleDateString(),
          cliente: venta.cliente || '',
          total: venta.total,
          metodo_pago: venta.metodo_pago || '',
        });
      });
    } else if (tipoReporte === 'inventario') {
      const datos = await reportesService.obtenerReporteInventario(fincaId, {});
      worksheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Cantidad', key: 'cantidad_actual', width: 15 },
        { header: 'Stock Minimo', key: 'stock_minimo', width: 15 },
        { header: 'Estado', key: 'estado', width: 15 },
      ];

      datos.data.forEach((producto) => {
        worksheet.addRow({
          nombre: producto.nombre,
          cantidad_actual: producto.cantidad_actual,
          stock_minimo: producto.stock_minimo || '',
          estado: producto.estado,
        });
      });
    } else {
      worksheet.addRow({ mensaje: 'Tipo de reporte no soportado' });
    }

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function exportarCSV(req, res) {
  try {
    const tipoReporte = req.query.tipo;
    const fincaId = req.user.finca_id;

    if (!tipoReporte) {
      return res.status(400).json({ success: false, mensaje: 'El tipo de reporte es requerido' });
    }

    const nombreArchivo = `reporte_${tipoReporte}_${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

    let csv = '';

    if (tipoReporte === 'animales') {
      csv += 'ID,Arete,Nombre,Sexo,Estado,Fecha Nacimiento\n';
      const datos = await reportesService.obtenerReporteAnimales(fincaId, {}, { limit: 1000, page: 1 });
      datos.data.forEach((animal) => {
        csv += `${animal.id},"${animal.arete || ''}","${animal.nombre || ''}",${animal.sexo},${animal.estado},"${animal.fecha_nacimiento || ''}"\n`;
      });
    } else if (tipoReporte === 'ventas') {
      csv += 'ID,Fecha,Cliente,Total,Metodo Pago\n';
      const datos = await reportesService.obtenerReporteVentas(fincaId, {}, { limit: 1000, page: 1 });
      datos.data.forEach((venta) => {
        csv += `${venta.id},"${new Date(venta.fecha).toLocaleDateString()}","${venta.cliente || ''}",${venta.total},"${venta.metodo_pago || ''}"\n`;
      });
    } else if (tipoReporte === 'inventario') {
      csv += 'Nombre,Cantidad,Stock Minimo,Estado\n';
      const datos = await reportesService.obtenerReporteInventario(fincaId, {});
      datos.data.forEach((producto) => {
        csv += `"${producto.nombre}",${producto.cantidad_actual},${producto.stock_minimo || ''},${producto.estado}\n`;
      });
    } else {
      csv += 'Tipo de reporte no soportado\n';
    }

    res.send(csv);
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

module.exports = {
  dashboard,
  reporteAnimales,
  reporteMovimientos,
  reporteSalud,
  reporteVentas,
  reporteInventario,
  reporteMortalidad,
  reportePorRaza,
  reportePorFinca,
  reporteReproduccion,
  reportePoblacion,
  exportarPDF,
  exportarExcel,
  exportarCSV,
  validarErrores,
  validaciones: {
    animales: [
      query('potreroId').optional().isInt(),
      query('especieId').optional().isInt(),
      query('razaId').optional().isInt(),
      query('sexo').optional().isIn(['MACHO', 'HEMBRA']),
      query('estado').optional().isIn(['ACTIVO', 'VENDIDO', 'FALLECIDO', 'EN_TRATAMIENTO']),
      query('edadMin').optional().isInt({ min: 0 }),
      query('edadMax').optional().isInt({ min: 0 }),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      query('page').optional().isInt({ min: 1 }),
      validarErrores,
    ],
    ventas: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      validarErrores,
    ],
    movimientos: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      query('animalId').optional().isInt(),
      query('tipoMovimiento').optional().isString(),
      validarErrores,
    ],
    salud: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      query('animalId').optional().isInt(),
      query('vacunaId').optional().isInt(),
      validarErrores,
    ],
    reproduccion: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      validarErrores,
    ],
  },
  middleware: [authMiddleware, permisosMiddleware(['ADMINISTRADOR', 'DUEÑO', 'VETERINARIO', 'EMPLEADO'])],
};
