const api = require('./api');
const auth = require('./auth');

const reportes = {
  dashboard: null,
  charts: {},
  paginaActual: {},
  filtrosActuales: {},

  async obtenerDashboard() {
    const response = await api.get('/reportes/dashboard');
    return response.data;
  },

  async obtenerAnimales(filtros = {}, paginacion = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    Object.entries(paginacion).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/reportes/animales?${params.toString()}`);
    return response.data;
  },

  async obtenerMovimientos(filtros = {}, paginacion = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    Object.entries(paginacion).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/reportes/movimientos?${params.toString()}`);
    return response.data;
  },

  async obtenerSalud(filtros = {}, paginacion = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    Object.entries(paginacion).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/reportes/salud?${params.toString()}`);
    return response.data;
  },

  async obtenerVentas(filtros = {}, paginacion = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    Object.entries(paginacion).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/reportes/ventas?${params.toString()}`);
    return response.data;
  },

  async obtenerInventario(filtros = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/reportes/inventario?${params.toString()}`);
    return response.data;
  },

  async obtenerMortalidad(filtros = {}, paginacion = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    Object.entries(paginacion).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/reportes/mortalidad?${params.toString()}`);
    return response.data;
  },

  async obtenerPorRaza(filtros = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/reportes/por-raza?${params.toString()}`);
    return response.data;
  },

  async obtenerPorFinca(filtros = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/reportes/por-finca?${params.toString()}`);
    return response.data;
  },

  async obtenerReproduccion(filtros = {}, paginacion = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    Object.entries(paginacion).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/reportes/reproduccion?${params.toString()}`);
    return response.data;
  },

  async obtenerPoblacion(filtros = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/reportes/poblacion?${params.toString()}`);
    return response.data;
  },

  exportar(tipo, formato) {
    const url = `/reportes/exportar/${formato}?tipo=${tipo}`;
    window.open(url, '_blank');
  },
};

function mostrarLoading(mostrar) {
  document.getElementById('loading').style.display = mostrar ? 'flex' : 'none';
}

function mostrarMensaje(mensaje, tipo = 'success') {
  const el = document.getElementById('mensaje');
  el.textContent = mensaje;
  el.className = `mensaje-overlay ${tipo}`;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 3000);
}

function formatearFecha(fecha) {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-ES');
}

function formatearMoneda(valor) {
  if (valor === null || valor === undefined) return '-';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(valor);
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '-';
  const nacimiento = new Date(fechaNacimiento);
  const ahora = new Date();
  const edad = ahora.getFullYear() - nacimiento.getFullYear();
  const m = ahora.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && ahora.getDate() < nacimiento.getDate())) {
    return `${edad - 1} anos`;
  }
  return `${edad} anos`;
}

function obtenerFiltros() {
  return {
    fechaInicio: document.getElementById('fechaInicio')?.value || undefined,
    fechaFin: document.getElementById('fechaFin')?.value || undefined,
    especieId: document.getElementById('filtroEspecie')?.value || undefined,
    razaId: document.getElementById('filtroRaza')?.value || undefined,
    sexo: document.getElementById('filtroSexo')?.value || undefined,
    estado: document.getElementById('filtroEstado')?.value || undefined,
  };
}

function limpiarFiltros() {
  document.getElementById('fechaInicio').value = '';
  document.getElementById('fechaFin').value = '';
  document.getElementById('filtroEspecie').value = '';
  document.getElementById('filtroRaza').value = '';
  document.getElementById('filtroSexo').value = '';
  document.getElementById('filtroEstado').value = '';
}

function renderizarPaginacion(containerId, paginacion, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container || !paginacion) return;

  const { page, totalPages } = paginacion;
  let html = '';

  if (totalPages > 1) {
    html += `<button ${page === 1 ? 'disabled' : ''} onclick="${onPageChange}(${page - 1})">Anterior</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="${i === page ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
    }
    html += `<button ${page === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${page + 1})">Siguiente</button>`;
  }

  container.innerHTML = html;
}

function renderizarKPI(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = items
    .map(
      (item) => `
      <div class="kpi-card">
        <div class="kpi-title">${item.titulo}</div>
        <div class="kpi-value">${item.valor}</div>
        ${item.subtitulo ? `<div class="kpi-sub">${item.subtitulo}</div>` : ''}
      </div>
    `
    )
    .join('');
}

function renderizarTabla(tablaId, filas, columnas) {
  const tbody = document.querySelector(`#${tablaId} tbody`);
  if (!tbody) return;

  if (!filas || filas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="100" class="empty-state">No existen registros para los filtros seleccionados.</td></tr>';
    return;
  }

  tbody.innerHTML = filas
    .map(
      (fila) => `
      <tr>
        ${columnas
          .map((col) => {
            let valor = fila[col.key];
            if (col.formatter) {
              valor = col.formatter(valor, fila);
            }
            return `<td>${valor ?? '-'}</td>`;
          })
          .join('')}
      </tr>
    `
    )
    .join('');
}

async function cargarDashboard() {
  mostrarLoading(true);
  try {
    const data = await reportes.obtenerDashboard();

    renderizarKPI('kpi-dashboard', [
      { titulo: 'Total Animales', valor: data.animales.total, subtitulo: `${data.animales.activos} activos` },
      { titulo: 'Machos', valor: data.animales.machos },
      { titulo: 'Hembras', valor: data.animales.hembras },
      { titulo: 'Vendidos', valor: data.animales.vendidos },
      { titulo: 'Fallecidos', valor: data.animales.fallecidos },
      { titulo: 'Ventas Totales', valor: formatearMoneda(data.finanzas.ventas) },
      { titulo: 'Balance', valor: formatearMoneda(data.finanzas.balance), subtitulo: data.finanzas.balance >= 0 ? 'Positivo' : 'Negativo' },
      { titulo: 'Stock Bajo', valor: data.inventario.stockBajo, subtitulo: `${data.inventario.productos} productos` },
    ]);

    if (typeof Chart === 'undefined') {
      console.warn('Chart.js no esta cargado');
      return;
    }

    if (reportes.charts.distribucionSexo) reportes.charts.distribucionSexo.destroy();
    if (reportes.charts.ventasMes) reportes.charts.ventasMes.destroy();
    if (reportes.charts.distribucionRaza) reportes.charts.distribucionRaza.destroy();

    reportes.charts.distribucionSexo = new Chart(document.getElementById('chart-distribucion-sexo'), {
      type: 'doughnut',
      data: {
        labels: data.distribuciones.sexo.map((s) => s.sexo),
        datasets: [{ data: data.distribuciones.sexo.map((s) => s.cantidad), backgroundColor: ['#2563eb', '#dc2626'] }],
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Distribucion por Sexo' } } },
    });

    reportes.charts.ventasMes = new Chart(document.getElementById('chart-ventas-mes'), {
      type: 'line',
      data: {
        labels: data.ventasPorMes.map((v) => v.mes),
        datasets: [{ label: 'Ventas', data: data.ventasPorMes.map((v) => v.total), borderColor: '#2563eb', tension: 0.3 }],
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Ventas por Mes' } } },
    });

    reportes.charts.distribucionRaza = new Chart(document.getElementById('chart-distribucion-raza'), {
      type: 'bar',
      data: {
        labels: data.distribuciones.raza.map((r) => r.raza),
        datasets: [{ label: 'Animales', data: data.distribuciones.raza.map((r) => r.cantidad), backgroundColor: '#2563eb' }],
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Animales por Raza' } } },
    });
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarAnimales(pagina = 1) {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerAnimales(filtros, { page: pagina, limit: 20 });
    reportes.filtrosActuales.animales = filtros;
    reportes.paginaActual.animales = pagina;

    renderizarKPI('kpi-animales', [
      { titulo: 'Total en Reporte', valor: data.pagination.total },
      { titulo: 'Pagina', valor: `${data.pagination.page} de ${data.pagination.totalPages}` },
    ]);

    const columnas = [
      { key: 'id' },
      { key: 'arete' },
      { key: 'nombre' },
      { key: 'sexo' },
      { key: 'especie', formatter: (v) => v?.nombre || '-' },
      { key: 'raza', formatter: (v) => v?.nombre || '-' },
      { key: 'fecha_nacimiento', formatter: formatearFecha },
      { key: 'fecha_nacimiento', formatter: calcularEdad },
      { key: 'estado' },
      { key: 'finca', formatter: (v) => v?.nombre || '-' },
      { key: 'potrero', formatter: (v) => v?.nombre || '-' },
    ];

    renderizarTabla('tabla-animales', data.data, columnas);
    renderizarPaginacion('paginacion-animales', data.pagination, 'cargarAnimales');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarMovimientos(pagina = 1) {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerMovimientos(filtros, { page: pagina, limit: 20 });

    const columnas = [
      { key: 'fecha', formatter: formatearFecha },
      { key: 'animal', formatter: (v) => v ? `${v.arete || ''} ${v.nombre || ''}`.trim() || '-' : '-' },
      { key: 'tipo' },
      { key: 'potrero_origen', formatter: (v) => v?.nombre || '-' },
      { key: 'potrero_destino', formatter: (v) => v?.nombre || '-' },
      { key: 'motivo' },
      { key: 'usuario', formatter: (v) => v?.nombre || '-' },
    ];

    renderizarTabla('tabla-movimientos', data.data, columnas);
    renderizarPaginacion('paginacion-movimientos', data.pagination, 'cargarMovimientos');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarSalud(pagina = 1) {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerSalud(filtros, { page: pagina, limit: 20 });

    renderizarKPI('kpi-salud', [
      { titulo: 'Vacunas Aplicadas', valor: data.pagination.total },
      { titulo: 'Vacunas Proximas', valor: data.vacunasProximas?.length || 0 },
    ]);

    const columnas = [
      { key: 'animal', formatter: (v) => v ? `${v.arete || ''} ${v.nombre || ''}`.trim() || '-' : '-' },
      { key: 'vacuna', formatter: (v) => v?.nombre || '-' },
      { key: 'fecha_aplicacion', formatter: formatearFecha },
      { key: 'proxima_dosis', formatter: formatearFecha },
      { key: 'vacuna', formatter: (v) => v?.dosis || '-' },
      { key: 'observaciones' },
      {
        key: 'proxima_dosis',
        formatter: (v) => {
          if (!v) return '';
          const dias = Math.ceil((new Date(v) - new Date()) / (1000 * 60 * 60 * 24));
          if (dias < 0) return '<span class="estado-vencido">Vencido</span>';
          if (dias <= 7) return '<span class="estado-proximo">Proximo</span>';
          return '<span class="estado-pendiente">Pendiente</span>';
        },
      },
    ];

    renderizarTabla('tabla-salud', data.data, columnas);
    renderizarPaginacion('paginacion-salud', data.pagination, 'cargarSalud');

    const tbodyProximas = document.querySelector('#tabla-vacunas-proximas tbody');
    if (data.vacunasProximas) {
      tbodyProximas.innerHTML = data.vacunasProximas
        .map(
          (v) => `
          <tr>
            <td>${v.animal ? `${v.animal.arete || ''} ${v.animal.nombre || ''}`.trim() || '-' : '-'}</td>
            <td>${v.vacuna?.nombre || '-'}</td>
            <td>${formatearFecha(v.proxima_dosis)}</td>
            <td>${v.animal?.finca?.nombre || '-'}</td>
            <td>
              ${(() => {
                const dias = Math.ceil((new Date(v.proxima_dosis) - new Date()) / (1000 * 60 * 60 * 24));
                if (dias < 0) return '<span class="estado-vencido">Vencido</span>';
                if (dias <= 7) return '<span class="estado-proximo">Proximo</span>';
                return '<span class="estado-pendiente">Pendiente</span>';
              })()}
            </td>
          </tr>
        `
        )
        .join('');
    }
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarVentas(pagina = 1) {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerVentas(filtros, { page: pagina, limit: 20 });

    renderizarKPI('kpi-ventas', [
      { titulo: 'Total Ventas', valor: formatearMoneda(data.resumen.totalVentas), subtitulo: `${data.resumen.cantidadVentas} ventas` },
      { titulo: 'Promedio', valor: formatearMoneda(data.resumen.promedioVenta) },
      { titulo: 'Animales Vendidos', valor: data.resumen.totalAnimales },
    ]);

    const columnas = [
      { key: 'id' },
      { key: 'fecha', formatter: formatearFecha },
      { key: 'cliente' },
      {
        key: 'detalles',
        formatter: (v) => {
          if (!v || !v.length) return '-';
          return v.map((d) => d.animal ? `${d.animal.arete || ''} ${d.animal.nombre || ''}`.trim() || '-' : '-').join(', ');
        },
      },
      {
        key: 'detalles',
        formatter: (v) => {
          if (!v || !v.length) return '-';
          const razas = [...new Set(v.map((d) => d.animal?.raza?.nombre).filter(Boolean))];
          return razas.join(', ') || '-';
        },
      },
      { key: 'total', formatter: formatearMoneda },
      { key: 'metodo_pago' },
    ];

    renderizarTabla('tabla-ventas', data.data, columnas);
    renderizarPaginacion('paginacion-ventas', data.pagination, 'cargarVentas');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarInventario() {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerInventario(filtros);

    renderizarKPI('kpi-inventario', [
      { titulo: 'Total Productos', valor: data.resumen.totalProductos },
      { titulo: 'Bajo Minimo', valor: data.resumen.bajoMinimo },
      { titulo: 'Agotados', valor: data.resumen.agotados },
      { titulo: 'Valor Estimado', valor: formatearMoneda(data.resumen.valorEstimado) },
    ]);

    const columnas = [
      { key: 'nombre' },
      { key: 'categoria' },
      { key: 'cantidad_actual' },
      { key: 'unidad_medida' },
      { key: 'stock_minimo' },
      {
        key: 'estado',
        formatter: (v) => {
          if (v === 'ACTIVO') return '<span class="estado-pendiente">Activo</span>';
          if (v === 'INACTIVO') return '<span class="estado-vencido">Inactivo</span>';
          if (v === 'VENCIDO') return '<span class="estado-vencido">Vencido</span>';
          return v;
        },
      },
      { key: 'precio_compra', formatter: formatearMoneda },
    ];

    renderizarTabla('tabla-inventario', data.data, columnas);
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarMortalidad(pagina = 1) {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerMortalidad(filtros, { page: pagina, limit: 20 });

    const columnas = [
      { key: 'id' },
      { key: 'arete' },
      { key: 'nombre' },
      { key: 'sexo' },
      { key: 'raza', formatter: (v) => v?.nombre || '-' },
      { key: 'finca', formatter: (v) => v?.nombre || '-' },
      { key: 'fecha_nacimiento', formatter: formatearFecha },
      { key: 'fecha_nacimiento', formatter: calcularEdad },
      { key: 'observaciones' },
    ];

    renderizarTabla('tabla-mortalidad', data.data, columnas);
    renderizarPaginacion('paginacion-mortalidad', data.pagination, 'cargarMortalidad');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarPorRaza() {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerPorRaza(filtros);

    const columnas = [
      { key: 'raza' },
      { key: 'total' },
      { key: 'machos' },
      { key: 'hembras' },
      { key: 'activos' },
      { key: 'vendidos' },
      { key: 'fallecidos' },
      { key: 'edadPromedio', formatter: (v) => `${v} anos` },
      { key: 'pesoPromedio', formatter: (v) => `${v} kg` },
    ];

    renderizarTabla('tabla-raza', data, columnas);
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarPorFinca() {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerPorFinca(filtros);

    const columnas = [
      { key: 'finca' },
      { key: 'total' },
      { key: 'machos' },
      { key: 'hembras' },
      { key: 'edadPromedio', formatter: (v) => `${v} anos` },
      { key: 'ventas', formatter: formatearMoneda },
      { key: 'fallecidos' },
      {
        key: 'potreros',
        formatter: (v) => {
          if (!v || !v.length) return '-';
          return v
            .map((p) => `${p.nombre} (${p.animalesActuales}/${p.capacidad || '?'})`)
            .join(', ');
        },
      },
    ];

    renderizarTabla('tabla-finca', data, columnas);
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarReproduccion(pagina = 1) {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerReproduccion(filtros, { page: pagina, limit: 20 });

    renderizarKPI('kpi-reproduccion', [
      { titulo: 'Hembras Reproductoras', valor: data.resumen.totalHembras },
      { titulo: 'Gestaciones', valor: data.resumen.gestaciones },
      { titulo: 'Abortos', valor: data.resumen.abortos },
      { titulo: 'Crias Nacidas', valor: data.resumen.criasNacidas },
      { titulo: 'Tasa Natalidad', valor: data.resumen.tasaNatalidad },
    ]);

    const columnas = [
      { key: 'fecha', formatter: formatearFecha },
      { key: 'animal', formatter: (v) => v ? `${v.arete || ''} ${v.nombre || ''}`.trim() || '-' : '-' },
      { key: 'tipo' },
      { key: 'resultado' },
      { key: 'observaciones' },
    ];

    renderizarTabla('tabla-reproduccion', data.reproducciones, columnas);
    renderizarPaginacion('paginacion-reproduccion', data.pagination, 'cargarReproduccion');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function cargarPoblacion() {
  mostrarLoading(true);
  try {
    const filtros = obtenerFiltros();
    const data = await reportes.obtenerPoblacion(filtros);

    const columnas = [
      { key: 'mes' },
      { key: 'poblacionInicial' },
      { key: 'nacimientos' },
      { key: 'ventas' },
      { key: 'fallecimientos' },
      { key: 'traslados' },
      { key: 'poblacionFinal' },
    ];

    renderizarTabla('tabla-poblacion', data, columnas);

    if (typeof Chart !== 'undefined') {
      if (reportes.charts.poblacion) reportes.charts.poblacion.destroy();

      reportes.charts.poblacion = new Chart(document.getElementById('chart-poblacion'), {
        type: 'line',
        data: {
          labels: data.map((p) => p.mes),
          datasets: [
            { label: 'Poblacion Inicial', data: data.map((p) => p.poblacionInicial), borderColor: '#2563eb' },
            { label: 'Poblacion Final', data: data.map((p) => p.poblacionFinal), borderColor: '#16a34a' },
            { label: 'Nacimientos', data: data.map((p) => p.nacimientos), borderColor: '#f59e0b' },
            { label: 'Ventas', data: data.map((p) => p.ventas), borderColor: '#dc2626' },
          ],
        },
        options: { responsive: true, plugins: { title: { display: true, text: 'Evolucion del Hato' } } },
      });
    }
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

const cargadores = {
  dashboard: cargarDashboard,
  animales: () => cargarAnimales(1),
  movimientos: () => cargarMovimientos(1),
  salud: () => cargarSalud(1),
  ventas: () => cargarVentas(1),
  inventario: cargarInventario,
  mortalidad: () => cargarMortalidad(1),
  raza: cargarPorRaza,
  finca: cargarPorFinca,
  reproduccion: () => cargarReproduccion(1),
  poblacion: cargarPoblacion,
};

const titulos = {
  dashboard: 'Dashboard de Reportes',
  animales: 'Inventario del Ganado',
  movimientos: 'Movimientos del Ganado',
  salud: 'Reporte Sanitario',
  ventas: 'Reporte de Ventas',
  inventario: 'Inventario de Insumos',
  mortalidad: 'Reporte de Mortalidad',
  raza: 'Reporte por Raza',
  finca: 'Reporte por Finca',
  reproduccion: 'Reporte de Reproduccion',
  poblacion: 'Evolucion de la Poblacion',
};

function cambiarReporte(tipo) {
  document.querySelectorAll('.seccion-reporte').forEach((s) => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));

  const seccion = document.getElementById(`seccion-${tipo}`);
  const nav = document.querySelector(`.nav-item[data-reporte="${tipo}"]`);
  if (seccion) seccion.classList.add('active');
  if (nav) nav.classList.add('active');

  document.getElementById('titulo-reporte').textContent = titulos[tipo] || 'Reportes';

  const cargador = cargadores[tipo];
  if (cargador) cargador();
}

function inicializarReportes() {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tipo = item.dataset.reporte;
      cambiarReporte(tipo);
    });
  });

  document.getElementById('btn-aplicar-filtros').addEventListener('click', () => {
    const activo = document.querySelector('.seccion-reporte.active');
    if (!activo) return;
    const tipo = activo.id.replace('seccion-', '');
    if (cargadores[tipo]) cargadores[tipo]();
  });

  document.getElementById('btn-limpiar-filtros').addEventListener('click', () => {
    limpiarFiltros();
    const activo = document.querySelector('.seccion-reporte.active');
    if (!activo) return;
    const tipo = activo.id.replace('seccion-', '');
    if (cargadores[tipo]) cargadores[tipo]();
  });

  document.querySelectorAll('[data-export]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.export;
      const formato = btn.dataset.format;
      reportes.exportar(tipo, formato);
    });
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    auth.logout();
    window.location.href = 'login.html';
  });

  cambiarReporte('dashboard');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', inicializarReportes);
}

module.exports = {
  ...reportes,
  cambiarReporte,
  inicializarReportes,
};
