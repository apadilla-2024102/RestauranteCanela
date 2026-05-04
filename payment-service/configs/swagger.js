export const createSwaggerDocument = (port) => ({
  openapi: '3.0.0',
  info: {
    title: 'Payment Service API',
    version: '1.0.0',
    description: 'Documentación Swagger para Payment Service',
  },
  servers: [{ url: `http://localhost:${port}/api/v1` }],
  paths: {
    '/health': {
      get: {
        summary: 'Estado del servicio',
        responses: { '200': { description: 'Servicio sano' } },
      },
    },
    '/payments': {
      get: { summary: 'Listar pagos', responses: { '200': { description: 'Pagos listados' } } },
      post: { summary: 'Crear un pago', responses: { '201': { description: 'Pago creado' } } },
    },
    '/payments/{id}': {
      get: {
        summary: 'Obtener un pago por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Pago encontrado' } },
      },
      put: {
        summary: 'Actualizar un pago por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Pago actualizado' } },
      },
      delete: {
        summary: 'Eliminar un pago por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Pago eliminado' } },
      },
    },
  },
});
