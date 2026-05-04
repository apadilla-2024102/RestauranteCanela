export const createSwaggerDocument = (port) => ({
  openapi: '3.0.0',
  info: {
    title: 'Restaurant Service API',
    version: '1.0.0',
    description: 'Documentación Swagger para Restaurant Service',
  },
  servers: [{ url: `http://localhost:${port}/api/v1` }],
  paths: {
    '/health': {
      get: {
        summary: 'Estado del servicio',
        responses: { '200': { description: 'Servicio sano' } },
      },
    },
    '/restaurants': {
      get: { summary: 'Listar restaurantes', responses: { '200': { description: 'Restaurantes listados' } } },
      post: { summary: 'Crear un restaurante', responses: { '201': { description: 'Restaurante creado' } } },
    },
    '/restaurants/{id}': {
      get: {
        summary: 'Obtener un restaurante por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Restaurante encontrado' } },
      },
      put: {
        summary: 'Actualizar un restaurante por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Restaurante actualizado' } },
      },
      delete: {
        summary: 'Eliminar un restaurante por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Restaurante eliminado' } },
      },
    },
  },
});
