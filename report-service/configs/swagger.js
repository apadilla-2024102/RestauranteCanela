export const createSwaggerDocument = (port) => ({
  openapi: '3.0.0',
  info: {
    title: 'Report Service API',
    version: '1.0.0',
    description: 'Documentación Swagger para Report Service',
  },
  servers: [{ url: `http://localhost:${port}/api/v1` }],
  paths: {
    '/health': {
      get: {
        summary: 'Estado del servicio',
        responses: { '200': { description: 'Servicio sano' } },
      },
    },
    '/reports': {
      get: { summary: 'Listar reportes', responses: { '200': { description: 'Reportes listados' } } },
      post: { summary: 'Crear un reporte', responses: { '201': { description: 'Reporte creado' } } },
    },
    '/reports/{id}': {
      get: {
        summary: 'Obtener un reporte por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Reporte encontrado' } },
      },
      put: {
        summary: 'Actualizar un reporte por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Reporte actualizado' } },
      },
      delete: {
        summary: 'Eliminar un reporte por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Reporte eliminado' } },
      },
    },
  },
});
